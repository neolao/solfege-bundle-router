"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _handlerStandard = require("./handler/Standard");

var _handlerStandard2 = _interopRequireDefault(_handlerStandard);

var _controller = require("./controller");

var _controller2 = _interopRequireDefault(_controller);

var _policy = require("./policy");

var _policy2 = _interopRequireDefault(_policy);

/**
 * A simple router for the HTTP server
 *
 * @class   solfege.bundle.router.Router
 */

var Router = (function (_solfege$kernel$EventEmitter) {
    _inherits(Router, _solfege$kernel$EventEmitter);

    _createClass(Router, null, [{
        key: "EVENT_ROUTES",

        /**
         * Event name of the beginning of the middleware
         *
         * @constant    {String} solfege.bundle.router.Router.EVENT_ROUTES
         * @default     "routes"
         */
        get: function get() {
            return "routes";
        }

        /**
         * Handler name of the standard strategy
         *
         * @constant    {String} solfege.bundle.router.Router.HANDLER_STANDARD
         * @default     "standard"
         */
    }, {
        key: "HANDLER_STANDARD",
        get: function get() {
            return "standard";
        }

        /**
         * Handler name of the Regexp strategy
         *
         * @constant    {String} solfege.bundle.router.Router.HANDLER_REGEXP
         * @default     "regexp"
         */
    }, {
        key: "HANDLER_REGEXP",
        get: function get() {
            return "regexp";
        }

        /**
         * Constructor
         */
    }]);

    function Router() {
        _classCallCheck(this, Router);

        _get(Object.getPrototypeOf(Router.prototype), "constructor", this).call(this);

        // The default handler
        this.defaultHandler = null;

        // Instance of the standard handler
        this.standardHandler = new _handlerStandard2["default"]();

        // The controller package
        this.controller = _controller2["default"];

        // The policy package
        this.policy = _policy2["default"];

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

    _createClass(Router, [{
        key: "setApplication",

        /**
         * Set the application
         *
         * @public
         * @param   {solfege.kernel.Application}    application     Application instance
         */
        value: function* setApplication(application) {
            this._application = application;
        }

        /**
         * Override the current configuration
         *
         * @public
         * @param   {Object} customConfiguration - The custom configuration
         */
    }, {
        key: "overrideConfiguration",
        value: function* overrideConfiguration(customConfiguration) {
            this._configuration = _extends(this._configuration, customConfiguration);

            // Parse the configuration
            this.parseConfiguration();
        }

        /**
         * Parse the configuration and initialize properties
         *
         * @private
         */
    }, {
        key: "parseConfiguration",
        value: function parseConfiguration() {
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
    }, {
        key: "middleware",
        value: function* middleware(request, response, next) {
            var skip = false;

            // Get a clone of the general routes
            var routes = [];
            if (this.configuration.routes) {
                routes = JSON.parse(JSON.stringify(this.configuration.routes));
            }

            // Dispatch an event
            // Note: For example, you can override the routes for this request
            yield this.emit(Router.EVENT_ROUTES, request, response, routes);

            // Check the routes that match the URL and policies
            var route = yield this.getRoute(routes, request, response);
            if (!route) {
                skip = true;
            }

            // Create the controller instance
            var controller = null;
            if (!skip) {
                controller = this.getController(route);
            }

            // Execute the action of the selected controller
            if (controller) {
                var action = controller[route.action];
                if ("function" !== typeof action || "GeneratorFunction" !== action.constructor.name) {
                    throw new Error("Invalid action \"" + route.action + "\" in the route \"" + route.id + "\".\n                     You must select a generator function.");
                }

                yield action.call(controller, request, response);
            }

            // Execute the next middleware
            yield* next;
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
    }, {
        key: "getRoute",
        value: function* getRoute(routes, request, response) {
            // Check the routes that match the URL
            var controller = null;
            var route = undefined;
            var nextRoute = this.getNextRoute(routes, request, response);
            while (route = nextRoute.next().value) {

                // Apply policies
                var policiesResult = null;
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
    }, {
        key: "getNextRoute",
        value: function* getNextRoute(routes, request, response) {
            // Find the route
            var routeCount = routes.length;
            var routeIndex = undefined;
            var route = undefined;
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
    }, {
        key: "applyPolicies",
        value: function* applyPolicies(route, request, response) {
            // Get the available policies
            var availablePolicies = this.configuration.policies || [];

            // Get the policies to apply
            var policies = route.policies || [];

            // Apply the policies
            var total = policies.length;
            var index = undefined;
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
        }

        /**
         * Get the controller instance
         *
         * @private
         * @param   {Object}    route       The route
         */
    }, {
        key: "getController",
        value: function getController(route) {
            var controller = undefined;

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
        }
    }, {
        key: "application",
        get: function get() {
            return this._application;
        }

        /**
         * The configuration
         *
         * @public
         * @member  {Object}
         */
    }, {
        key: "configuration",
        get: function get() {
            return this._configuration;
        }
    }]);

    return Router;
})(_solfegejs2["default"].kernel.EventEmitter);

exports["default"] = Router;
module.exports = exports["default"];