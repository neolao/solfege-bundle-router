"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _isGenerator = require("is-generator");

var _Routes = require("../Routes");

var _Routes2 = _interopRequireDefault(_Routes);

var _Standard = require("../url-matchers/Standard");

var _Standard2 = _interopRequireDefault(_Standard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RouterMiddleware {
    constructor() {
        this.routes = new _Routes2.default();

        this.urlMatchers = {};
        this.addUrlMatcher("standard", new _Standard2.default());
    }

    addUrlMatcher(name, urlMatcher) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        this.urlMatchers[name] = urlMatcher;
    }

    hasUrlMatcher(name) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        return this.urlMatchers.hasOwnProperty(name);
    }

    getUrlMatcher(name) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        return this.urlMatchers[name];
    }

    *loadRoutes(loader, filePath) {
        if (!(typeof filePath === 'string')) {
            throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
        }

        var routes = yield loader.load(filePath);

        this.routes.addRoutes(routes);
    }

    getRoutes() {
        return this.routes;
    }

    *handle(request, response, next) {
        var routes = this.routes.getList();

        var route = yield this.getRoute(routes, request, response);
        if (!route) {
            yield* next;
            return;
        }

        var controller = route.getController();
        if (!controller) {
            yield* next;
            return;
        }

        var actionName = route.getActionName();
        var action = controller[actionName];
        if (!(0, _isGenerator.fn)(action)) {
            throw new Error("Invalid action \"" + route.action + "\" in the route \"" + route.id + "\".\n                 You must select a generator function.");
        }

        yield action.call(controller, request, response);

        yield* next;
    }

    *getRoute(routes, request, response) {
        var controller = null;
        var route = void 0;
        var nextRoute = this.getNextRoute(routes, request, response);
        while (route = nextRoute.next().value) {
            var policiesResult = null;
            policiesResult = yield this.applyPolicies(route, request, response);
            if (!policiesResult) {
                continue;
            }

            return route;
        }

        return null;
    }

    *getNextRoute(routes, request, response) {
        var routeCount = routes.length;
        var routeIndex = void 0;
        var route = void 0;
        for (routeIndex = 0; routeIndex < routeCount; ++routeIndex) {
            route = routes[routeIndex];

            var urlMatcherId = route.getUrlMatcherId();
            if (!this.hasUrlMatcher(urlMatcherId)) {
                urlMatcherId = "standard";
            }
            var urlMatcher = this.getUrlMatcher(urlMatcherId);

            var matched = urlMatcher.match(request, response, route);
            if (matched) {
                yield route;
            }
        }
    }

    *applyPolicies(route, request, response) {
        return true;

        var availablePolicies = this.configuration.policies || [];

        var policies = route.policies || [];

        var total = policies.length;
        var index = void 0;
        for (index = 0; index < total; ++index) {
            var policy = policies[index];

            if ('string' === typeof policy && availablePolicies.hasOwnProperty(policy)) {
                policy = availablePolicies[policy];
            }

            if ('string' === typeof policy) {
                policy = this.application.resolveSolfegeUri(policy, this);
            }

            if ('function' !== typeof policy || 'GeneratorFunction' !== policy.constructor.name) {
                continue;
            }

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