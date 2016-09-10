"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _isGenerator = require("is-generator");

var _configYaml = require("config-yaml");

var _configYaml2 = _interopRequireDefault(_configYaml);

var _Routes = require("./Routes");

var _Routes2 = _interopRequireDefault(_Routes);

var _Route = require("./Route");

var _Route2 = _interopRequireDefault(_Route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * YAML loader for routes
 */
class YamlLoader {
    /**
     * Constructor
     *
     * @param   {object}    container   Solfege service container
     */
    constructor(container) {
        this.container = container;
    }

    /**
     * Load YAML file
     *
     * @param   {string}    filePath    YAML file path
     * @return  {Routes}                Routes container
     */
    *load(filePath) {
        if (!(typeof filePath === 'string')) {
            throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
        }

        var routes = new _Routes2.default();

        var config = (0, _configYaml2.default)(filePath, { encoding: "utf8" });
        for (var routeId in config) {
            var route = yield this.buildRoute(routeId, config[routeId]);
            routes.addRoute(route);
        }

        return routes;
    }

    /**
     * Build route
     *
     * @param   {string}    id      Route id
     * @param   {object}    config  Route configuration
     * @return  {Route}             Route instance
     */
    *buildRoute(id, config) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        var route = new _Route2.default();
        route.setId(id);

        // Get controller instance from configuration
        var controllerId = config.controller;
        var controller = yield this.container.resolveParameter(controllerId);
        if ((typeof controller === "undefined" ? "undefined" : _typeof(controller)) !== "object") {
            throw new Error("Invalid route " + id + ", the controller is not a service");
        }
        route.setController(controller);

        // Get action method name
        var actionName = config.action;
        if (!(0, _isGenerator.fn)(controller[actionName])) {
            throw new Error("Invalid route " + id + ", the action is not a generator function");
        }
        route.setActionName(actionName);

        // Get path
        var path = config.path;
        route.setPath(path);

        return route;
    }
}
exports.default = YamlLoader;

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