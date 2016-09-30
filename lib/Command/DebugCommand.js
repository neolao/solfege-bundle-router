"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _easyTable = require("easy-table");

var _easyTable2 = _interopRequireDefault(_easyTable);

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _RouterMiddleware = require("../middlewares/RouterMiddleware");

var _RouterMiddleware2 = _interopRequireDefault(_RouterMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DebugCommand {
    constructor(serverFactory) {
        this.serverFactory = serverFactory;
    }

    getName() {
        return "router:debug";
    }

    getDescription() {
        return "Debug the routing";
    }

    *execute() {
        var serverNames = this.serverFactory.getServerNames();

        var rows = [];

        if (!(serverNames && (typeof serverNames[Symbol.iterator] === 'function' || Array.isArray(serverNames)))) {
            throw new TypeError("Expected serverNames to be iterable, got " + _inspect(serverNames));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = serverNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var serverName = _step.value;

                var serverRows = yield this.displayServerRoutes(serverName);
                rows = rows.concat(serverRows);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        console.log(_easyTable2.default.print(rows, {
            serverName: {
                name: _colors2.default.yellow("Server")
            },
            id: {
                name: _colors2.default.yellow("Id")
            },
            methods: {
                name: _colors2.default.yellow("Methods")
            },
            path: {
                name: _colors2.default.yellow("Path")
            },
            controller: {
                name: _colors2.default.yellow("Controller")
            },
            action: {
                name: _colors2.default.yellow("Action")
            }
        }));
    }

    *displayServerRoutes(serverName) {
        if (!(typeof serverName === 'string')) {
            throw new TypeError("Value of argument \"serverName\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(serverName));
        }

        var middlewares = this.serverFactory.getMiddlewares(serverName);
        var routerMiddleware = void 0;

        if (!(middlewares && (typeof middlewares[Symbol.iterator] === 'function' || Array.isArray(middlewares)))) {
            throw new TypeError("Expected middlewares to be iterable, got " + _inspect(middlewares));
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = middlewares[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var middleware = _step2.value;

                if (middleware.instance instanceof _RouterMiddleware2.default) {
                    routerMiddleware = middleware.instance;
                    break;
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        if (!routerMiddleware) {
            return;
        }

        var routes = routerMiddleware.getRoutes();
        var list = routes.getList();

        var rows = [];

        if (!(list && (typeof list[Symbol.iterator] === 'function' || Array.isArray(list)))) {
            throw new TypeError("Expected list to be iterable, got " + _inspect(list));
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var route = _step3.value;

                var controllerName = "";
                var controllerId = route.getControllerId();
                var controller = route.getController();
                if (controllerId) {
                    controllerName = controllerId;
                } else if ((typeof controller === "undefined" ? "undefined" : _typeof(controller)) === "object" && typeof controller.constructor === "function") {
                    controllerName = controller.constructor.name;
                }

                var methodNames = "*";
                var methods = route.getMethods();
                if (methods.length > 0) {
                    methodNames = methods.join(", ");
                }

                rows.push({
                    serverName: serverName,
                    id: route.getId(),
                    methods: methodNames,
                    path: route.getPath(),
                    controller: controllerName,
                    action: route.getActionName()
                });
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        return rows;
    }
}
exports.default = DebugCommand;

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