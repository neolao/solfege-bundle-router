"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _isGenerator = require("is-generator");

var _YamlLoader = require("../routes-loader/YamlLoader");

var _YamlLoader2 = _interopRequireDefault(_YamlLoader);

var _Routes = require("../routes-loader/Routes");

var _Routes2 = _interopRequireDefault(_Routes);

var _Standard = require("../url-matchers/Standard");

var _Standard2 = _interopRequireDefault(_Standard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Router middleware
 */
class RouterMiddleware {
    /**
     * Constructor
     */
    constructor() {
        // Initialize routes
        this.routes = new _Routes2.default();

        // Initialize URL matchers
        // And add the standard matcher
        this.urlMatchers = {};
        this.addUrlMatcher("standard", new _Standard2.default());
    }

    /**
     * Add URL matcher
     *
     * @param   {string}    name        Matcher name
     * @param   {object}    urlMatcher  Matcher instance
     */
    addUrlMatcher(name, urlMatcher) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        this.urlMatchers[name] = urlMatcher;
    }

    /**
     * Indicatesthat the URL matcher exists
     *
     * @param   {string}    name        Matcher name
     * @return  {boolean}               true if the matcher exists, false otherwise
     */
    hasUrlMatcher(name) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        return this.urlMatchers.hasOwnProperty(name);
    }

    /**
     * Get URL matcher
     *
     * @param   {string}    name        Matcher name
     * @return  {object}                Matcher instance
     */
    getUrlMatcher(name) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        return this.urlMatchers[name];
    }

    /**
     * Load routes from file path
     *
     * @param   {object}    loader      Routes loader
     * @param   {string}    filePath    Routes file path
     */
    *loadRoutes(loader, filePath) {
        if (!(typeof filePath === 'string')) {
            throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
        }

        var routes = yield loader.load(filePath);

        // Add loaded routes to the main routes
        this.routes.addRoutes(routes);
    }

    /**
     * Handle a request
     *
     * @param   {Request}   request     The request
     * @param   {Response}  response    The response
     * @param   {object}    next        The next middleware
     */
    *handle(request, response, next) {
        var routes = this.routes.getList();

        // Dispatch an event
        // Note: For example, you can override the routes for this request
        //yield this.emit(Router.EVENT_ROUTES, request, response, routes);

        // Check the routes that match the URL and policies
        var route = yield this.getRoute(routes, request, response);
        if (!route) {
            yield* next;
            return;
        }

        // Create the controller instance
        var controller = route.getController();
        if (!controller) {
            yield* next;
            return;
        }

        // Execute the action of the selected controller
        var actionName = route.getActionName();
        var action = controller[actionName];
        if (!(0, _isGenerator.fn)(action)) {
            throw new Error("Invalid action \"" + route.action + "\" in the route \"" + route.id + "\".\n                 You must select a generator function.");
        }

        yield action.call(controller, request, response);

        // Execute the next middleware
        yield* next;
    }

    /**
     * Get the route that match the request and validate the policies
     *
     * @private
     * @param   {Array}     routes      The routes
     * @param   {Request}   request     The request
     * @param   {Response}  response    The response
     * @return  {Object}                The matching route
     */
    *getRoute(routes, request, response) {
        // Check the routes that match the URL
        var controller = null;
        var route = void 0;
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
     * @param   {Array}     routes      The routes
     * @param   {Request}   request     The request
     * @param   {Response}  response    The response
     * @return  {Object}                The matching route
     */
    *getNextRoute(routes, request, response) {
        // Find the route
        var routeCount = routes.length;
        var routeIndex = void 0;
        var route = void 0;
        for (routeIndex = 0; routeIndex < routeCount; ++routeIndex) {
            route = routes[routeIndex];

            // Get the URL matcher to use
            var urlMatcherId = route.getUrlMatcherId();
            if (!this.hasUrlMatcher(urlMatcherId)) {
                urlMatcherId = "standard";
            }
            var urlMatcher = this.getUrlMatcher(urlMatcherId);

            // If the route matches the request, then stop here
            var matched = urlMatcher.match(request, response, route);
            if (matched) {
                yield route;
            }
        }
    }

    /**
     * Apply the policies
     *
     * @private
     * @param   {Route}                             route       The route
     * @param   {solfege.bundle.server.Request}     request     The request
     * @param   {solfege.bundle.server.Response}    response    The response
     */
    *applyPolicies(route, request, response) {
        return true;

        // Get the available policies
        var availablePolicies = this.configuration.policies || [];

        // Get the policies to apply
        var policies = route.policies || [];

        // Apply the policies
        var total = policies.length;
        var index = void 0;
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
}
exports.default = RouterMiddleware;

function _inspect(input) {
    function _ref2(key) {
        return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }

    function _ref(item) {
        return _inspect(item) === first;
    }

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === "undefined" ? "undefined" : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var first = _inspect(input[0]);

            if (input.every(_ref)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.map(_inspect).join(', ') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        var entries = keys.map(_ref2).join('\n  ');

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + entries + '\n}';
        } else {
            return '{ ' + entries + '\n}';
        }
    }
}

module.exports = exports['default'];