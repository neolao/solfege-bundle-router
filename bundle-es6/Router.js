import solfege from "solfegejs";

import StandardHandler from "./handler/Standard";
import controllerPackage from "./controller";
import policyPackage from "./policy";

/**
 * A simple router for the HTTP server
 *
 * @class   solfege.bundle.router.Router
 */
export default class Router extends solfege.kernel.EventEmitter
{
    /**
     * Event name of the beginning of the middleware
     *
     * @constant    {String} solfege.bundle.router.Router.EVENT_ROUTES
     * @default     "routes"
     */
    static get EVENT_ROUTES()
    {
        return "routes";
    }

    /**
     * Handler name of the standard strategy
     *
     * @constant    {String} solfege.bundle.router.Router.HANDLER_STANDARD
     * @default     "standard"
     */
    static get HANDLER_STANDARD()
    {
        return "standard";
    }

    /**
     * Handler name of the Regexp strategy
     *
     * @constant    {String} solfege.bundle.router.Router.HANDLER_REGEXP
     * @default     "regexp"
     */
    static get HANDLER_REGEXP()
    {
        return "regexp";
    }

    /**
     * Constructor
     */
    constructor()
    {
        super();

        // The default handler
        this.defaultHandler = null;

        // Instance of the standard handler
        this.standardHandler = new StandardHandler();

        // The controller package
        this.controller = controllerPackage;

        // The policy package
        this.policy = policyPackage;

        // Cache of the controller instance
        this.controllerCache = {};

        // Set the default configuration
        this._configuration = require('../configuration/default.js');

        // The application instance
        this._application = null;

        // Parse the configuration
        this.parseConfiguration();
    }

    /**
     * The application instance
     *
     * @public
     * @member  {solfege.kernel.Application}
     */
    get application()
    {
        return this._application;
    }

    /**
     * The configuration
     *
     * @public
     * @member  {Object}
     */
    get configuration()
    {
        return this._configuration;
    }

    /**
     * Set the application
     *
     * @public
     * @param   {solfege.kernel.Application}    application     Application instance
     */
    *setApplication(application)
    {
        this._application = application;
    }

    /**
     * Override the current configuration
     *
     * @public
     * @param   {Object} customConfiguration - The custom configuration
     */
    *overrideConfiguration(customConfiguration)
    {
        this._configuration = Object.assign(this._configuration, customConfiguration);

        // Parse the configuration
        this.parseConfiguration();
    }

    /**
     * Parse the configuration and initialize properties
     *
     * @private
     */
    parseConfiguration()
    {
        // Set the default handler
        switch (this.configuration.handler) {
            default:
            case Router.HANDLER_STANDARD:
                this.defaultHandler = this.standardHandler;
                break;
        }
    }

    /**
     * The server middleware
     * The goal is to execute an action of a controller
     *
     * @public
     * @param   {solfege.bundle.server.Request}     request     The request
     * @param   {solfege.bundle.server.Response}    response    The response
     * @param   {GeneratorFunction}                 next        The next function
     */
    *middleware(request, response, next)
    {
        let skip = false;

        // Get a clone of the general routes
        let routes = [];
        if (this.configuration.routes) {
            routes = JSON.parse(JSON.stringify(this.configuration.routes));
        }

        // Dispatch an event
        // Note: For example, you can override the routes for this request
        yield this.emit(Router.EVENT_ROUTES, request, response, routes);

        // Check the routes that match the URL and policies
        let route = yield this.getRoute(routes, request, response);
        if (!route) {
            skip = true;
        }

        // Create the controller instance
        let controller = null;
        if (!skip) {
            controller = this.getController(route);
        }

        // Execute the action of the selected controller
        if (controller) {
            let action = controller[route.action];
            if ("function" !== typeof action || "GeneratorFunction" !== action.constructor.name) {
                throw new Error(
                    `Invalid action "${route.action}" in the route "${route.id}".
                     You must select a generator function.`
                );
            }

            yield action.call(controller, request, response);
        }

        // Execute the next middleware
        yield *next;
    }

    /**
     * Get the route that match the request and validate the policies
     *
     * @private
     * @param   {Array} routes - The routes
     * @param   {solfege.bundle.server.Request} request - The request
     * @param   {solfege.bundle.server.Response} response - The response
     * @return  {Object} The matching route
     */
    *getRoute(routes, request, response)
    {
        // Check the routes that match the URL
        let controller = null;
        let route;
        let nextRoute = this.getNextRoute(routes, request, response);
        while (route = nextRoute.next().value) {

            // Apply policies
            let policiesResult = null;
            policiesResult = yield this.applyPolicies(route, request, response);
            if (!policiesResult) {
                continue;
            }

            return route;
        }

        return null;
    }

    /**
     * Get the route that match the request
     *
     * @private
     * @param   {Array} routes - The routes
     * @param   {solfege.bundle.server.Request} request - The request
     * @param   {solfege.bundle.server.Response} response - The response
     * @return  {Object} The matching route
     */
    *getNextRoute(routes, request, response)
    {
        // Find the route
        let routeCount = routes.length;
        let routeIndex;
        let route;
        for (routeIndex = 0; routeIndex < routeCount; ++routeIndex) {
            route = routes[routeIndex];

            // Get the handler to use
            let handler = this.defaultHandler;
            switch (true) {
                case route.handler === Router.HANDLER_STANDARD:
                    handler = this.standardHandler;
                    break;
                case 'function' === typeof route.handler:
                    handler = route.handler;
                    break;
            }

            // If the route matches the request, then stop here
            let matched = handler.match(request, response, route);
            if (matched) {
                yield route;
            }
        }

    }

    /**
     * Apply the policies
     *
     * @private
     * @param   {Object}                            route       The route
     * @param   {solfege.bundle.server.Request}     request     The request
     * @param   {solfege.bundle.server.Response}    response    The response
     */
    *applyPolicies(route, request, response)
    {
        // Get the available policies
        let availablePolicies = this.configuration.policies || [];

        // Get the policies to apply
        let policies = route.policies || [];

        // Apply the policies
        let total = policies.length;
        let index;
        for (index = 0; index < total; ++index) {
            let policy = policies[index];

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
            let policyResult = yield policy(request, response);
            if (!policyResult) {
                return false;
            }
        }

        return true;
    }
    /**
     * Get the controller instance
     *
     * @private
     * @param   {Object}    route       The route
     */
    getController(route)
    {
        let controller;

        if ('string' === typeof route.controller) {
            // The controller is a solfege uri

            // Check the cache
            // Create the instance if necessary
            if (this.controllerCache.hasOwnProperty(route.controller)) {
                controller = this.controllerCache[route.controller];
            } else {
                let controllerClass = this.application.resolveSolfegeUri(route.controller, this);
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
    }
}

