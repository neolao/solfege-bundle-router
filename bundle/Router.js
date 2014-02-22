var solfege = require('solfegejs');
var StandardHandler = require('./handler/Standard');
var controllerPackage = require('./controller');
var policyPackage = require('./policy');


/**
 * A simple router for the HTTP server
 */
var Router = solfege.util.Class.create(function()
{
    // Call parent constructor
    solfege.kernel.EventEmitter.call(this);

    // Initialize properties
    this.standardHandler = new StandardHandler();
    this.controllerCache = {};
    this.controller = controllerPackage;
    this.policy = policyPackage;

    // Set the default configuration
    this.configuration = require('../configuration/default.js');

    // Parse the configuration
    this.parseConfiguration();

}, 'solfege.bundle.router.Router', solfege.kernel.EventEmitter);
var proto = Router.prototype;

// Constants
solfege.util.Object.define(Router, 'EVENT_ROUTES', 'routes');
solfege.util.Object.define(Router, 'HANDLER_STANDARD', 'standard');
solfege.util.Object.define(Router, 'HANDLER_REGEXP', 'regexp');


/**
 * The application instance
 *
 * @type {solfege.kernel.Application}
 * @api private
 */
proto.application;

/**
 * The configuration
 *
 * @type {Object}
 * @api private
 */
proto.configuration;

/**
 * The default handler
 *
 * @type {HandlerInterface}
 * @api private
 */
proto.defaultHandler;

/**
 * Instance of the standard handler
 *
 * @type {HandlerInterface}
 * @api private
 */
proto.standardHandler;

/**
 * Cache of the controller instances
 *
 * @type {Object}
 * @api private
 */
proto.controllerCache;

/**
 * The controller package
 *
 * @type {Object}
 * @api public
 */
proto.controller;

/**
 * The policy package
 *
 * @type {Object}
 * @api public
 */
proto.policy;

/**
 * Set the application
 *
 * @param   {solfege.kernel.Application}    application     Application instance
 */
proto.setApplication = function*(application)
{
    this.application = application;
};

/**
 * Override the current configuration
 *
 * @param   {Object}    customConfiguration     The custom configuration
 * @api public
 */
proto.overrideConfiguration = function*(customConfiguration)
{
    this.configuration = solfege.util.Object.merge(this.configuration, customConfiguration);

    // Parse the configuration
    this.parseConfiguration();
};

/**
 * Parse the configuration and initialize properties
 *
 * @api private
 */
proto.parseConfiguration = function()
{
    // Set the default handler
    switch (this.configuration.handler) {
        default:
        case Router.HANDLER_STANDARD:
            this.defaultHandler = this.standardHandler;
            break;
    }
};

/**
 * The server middleware
 * The goal is to execute an action of a controller
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 * @param   {GeneratorFunction}                 next        The next function
 */
proto.middleware = function*(request, response, next)
{
    var skip = false;

    // Get a clone of the general routes
    var routes = [];
    if (this.configuration.routes) {
        routes = JSON.parse(JSON.stringify(this.configuration.routes));
    }

    // Dispatch an event
    // Note: For example, you can override the routes for this request
    yield this.emit(Router.EVENT_ROUTES, request, response, routes);

    // Find the route
    var route = this.getRoute(routes, request, response);
    skip = (!route);

    // Apply policies
    if (!skip) {
        var policiesResult = yield this.applyPolicies(route, request, response);
        skip = (!policiesResult);
    }

    // Create the controller instance
    if (!skip) {
        var controller = this.getController(route);
        skip = (!controller);
    }

    // Execute the action of the selected controller
    if (!skip) {
        var action = controller[route.action];
        if ('function' !== typeof action || 'GeneratorFunction' !== action.constructor.name) {
            throw new Error('Invalid action "' + route.action + '" in the route "' + route.id + '". You must select a generator function.');
        }

        yield action.call(controller, request, response);
    }

    // Execute the next middleware
    yield *next;
};

/**
 * Get the route that match the request
 *
 * @param   {Array}                             routes      The routes
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 */
proto.getRoute = function(routes, request, response)
{
    // Find the route
    var routeCount = routes.length;
    var routeIndex;
    var route;
    for (routeIndex = 0; routeIndex < routeCount; ++routeIndex) {
        route = routes[routeIndex];

        // Get the handler to use
        var handler = this.defaultHandler;
        switch (true) {
            case route.handler === Router.HANDLER_STANDARD:
                handler = this.standardHandler;
                break;
            case 'function' === typeof route.handler:
                handler = route.handler;
                break;
        }

        // If the route matches the request, then stop here
        var matched = handler.match(request, response, route);
        if (matched) {
            return route;
        }
    }

    return null;
};

/**
 * Apply the policies
 *
 * @param   {Object}                            route       The route
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 */
proto.applyPolicies = function*(route, request, response)
{
    // Get the available policies
    var availablePolicies = this.configuration.policies || [];

    // Get the policies to apply
    var policies = route.policies || [];

    // Apply the policies
    var total = policies.length;
    var index;
    for (index = 0; index < total; ++index) {
        var policy = policies[index];

        // The policy is a string, check the available policies
        if ('string' === typeof policy && availablePolicies.hasOwnProperty(policy)) {
            policy = availablePolicies[policy];
        }

        // The policy is a string, check if it is a solfege URI
        if ('string' === typeof policy) {
            policy = this.application.resolveSolfegeUri(policy, this);
        }

        // Check if the policy is a generator function
        if ('function' !== typeof policy || 'GeneratorFunction' !== policy.constructor.name) {
            continue;
        }

        // Execute the policy
        var policyResult = yield policy(request, response);
        if (!policyResult) {
            return false;
        }
    }

    return true;
};

/**
 * Get the controller instance
 *
 * @param   {Object}    route       The route
 */
proto.getController = function(route)
{
    var controller;

    if ('string' === typeof route.controller) {
        // The controller is a solfege uri

        // Check the cache
        // Create the instance if necessary
        if (this.controllerCache.hasOwnProperty(route.controller)) {
            controller = this.controllerCache[route.controller];
        } else {
            var controllerClass = this.application.resolveSolfegeUri(route.controller, this);
            controller = new controllerClass();

            // Save into the cache
            this.controllerCache[route.controller] = controller;
        }

    } else if ('function' === typeof route.controller) {
        // The controller instance is already created
        controller = route.controller;
    }

    if (!controller) {
        throw new Error('Invalid controller "' + route.controller + '" in the route "' + route.id + '"');
    }
    return controller;
};

module.exports = Router;
