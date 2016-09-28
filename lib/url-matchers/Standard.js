"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _Route = require("../routes-loader/Route");

var _Route2 = _interopRequireDefault(_Route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Standard {
    constructor() {}

    match(request, response, route) {
        if (!(route instanceof _Route2.default)) {
            throw new TypeError("Value of argument \"route\" violates contract.\n\nExpected:\nRoute\n\nGot:\n" + _inspect(route));
        }

        var routePath = route.getPath();
        var requestObject = _url2.default.parse(request.url, true);

        var routeSplitted = routePath.split(/:[a-zA-Z]+/);
        var pattern = new RegExp('^' + routeSplitted.join('([^/]+)') + '$');

        if (pattern.test(requestObject.pathname)) {
            var parameterValues = pattern.exec(requestObject.pathname);
            parameterValues.shift();
            var parameterCount = parameterValues.length;
            var parameterPattern = /:[a-zA-Z]+/g;
            var parameterNames = routePath.match(parameterPattern);
            for (var index = 0; index < parameterCount; ++index) {
                var parameterName = parameterNames[index].substr(1);
                var parameterValue = parameterValues[index];

                request.setParameter(parameterName, parameterValue);
            }

            return true;
        }

        return false;
    }

}
exports.default = Standard;

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