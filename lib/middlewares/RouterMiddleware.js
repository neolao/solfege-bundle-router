"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _isGenerator = require("is-generator");

var _Routes = require("../Routes");

var _Routes2 = _interopRequireDefault(_Routes);

var _Standard = require("../url-matchers/Standard");

var _Standard2 = _interopRequireDefault(_Standard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RouterMiddleware = class RouterMiddleware {
    constructor() {
        this.routes = new _Routes2.default();

        this.urlMatchers = {};
        this.addUrlMatcher("standard", new _Standard2.default());
    }

    addUrlMatcher(name, urlMatcher) {
        this.urlMatchers[name] = urlMatcher;
    }

    hasUrlMatcher(name) {
        return this.urlMatchers.hasOwnProperty(name);
    }

    getUrlMatcher(name) {
        return this.urlMatchers[name];
    }

    *loadRoutes(loader, path) {
        var routes = yield loader.load(path);

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
    }
};
exports.default = RouterMiddleware;
module.exports = exports["default"];