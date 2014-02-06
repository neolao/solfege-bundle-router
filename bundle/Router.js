var solfege = require('solfegejs');
var StandardHandler = require('./handler/Standard');

/**
 * A simple router for the HTTP server
 */
var Router = solfege.util.Class.create(function()
{
    // Call parent constructor
    solfege.kernel.EventEmitter.call(this);

    // Initialize properties
    this.standardHandler = new StandardHandler();

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
 * Override the current configuration
 *
 * @param   {Object}    customConfiguration     The custom configuration
 */
proto.overrideConfiguration = function*(customConfiguration)
{
    this.configuration = solfege.util.Object.merge(this.configuration, customConfiguration);

    // Parse the configuration
    this.parseConfiguration();
};

/**
 * Parse the configuration and initialize properties
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
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 * @param   {GeneratorFunction}                 next        The next function
 */
proto.middleware = function*(request, response, next)
{
    // Get a clone of the general routes
    var routes = [];
    if (this.configuration.routes) {
        routes = JSON.parse(JSON.stringify(this.configuration.routes));
    }

    // Dispatch an event
    // Note: For example, you can override the routes for this request
    yield this.emit(Router.EVENT_ROUTES, request, response, routes);

    // Find the route
    var routeCount = routes.length;
    var routeIndex;
    var route;
    var routeFound = false;
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
            routeFound = true;
            break;
        }
    }

    // The route is found
    if (routeFound) {
        // Apply policies
        // @todo

        // Execute the action of the selected controller
        // @todo
    }

    // Execute the next middleware
    yield *next;
};

module.exports = Router;
