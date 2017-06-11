"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _isGenerator = require("is-generator");

var _Routes = require("../Routes");

var _Routes2 = _interopRequireDefault(_Routes);

var _Route = require("../Route");

var _Route2 = _interopRequireDefault(_Route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DirectoryLoader = class DirectoryLoader {
    constructor(container) {
        this.container = container;
    }

    *load(path) {
        var routes = new _Routes2.default();

        return routes;
    }

    *buildRoute(id, config) {
        var route = new _Route2.default();
        route.setId(id);

        var controllerId = config.controller;
        var controller = yield this.container.resolveParameter(controllerId);
        if ((typeof controller === "undefined" ? "undefined" : _typeof(controller)) !== "object") {
            throw new Error("Invalid route " + id + ", the controller is not a service");
        }
        route.setControllerId(controllerId);
        route.setController(controller);

        var actionName = config.action;
        if (!(0, _isGenerator.fn)(controller[actionName])) {
            throw new Error("Invalid route " + id + ", the action is not a generator function");
        }
        route.setActionName(actionName);

        var path = config.path;
        route.setPath(path);

        return route;
    }
};
exports.default = DirectoryLoader;
module.exports = exports["default"];