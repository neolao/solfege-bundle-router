"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

class Route {
    constructor() {
        this.id;
        this.controllerId;
        this.controller;
        this.actionName;
        this.path;
        this.methods = [];
        this.urlMatcherId = "standard";
    }

    getId() {
        return this.id;
    }

    setId(id) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        this.id = id;
    }

    getControllerId() {
        return this.controllerId;
    }

    setControllerId(id) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        this.controllerId = id;
    }

    getController() {
        return this.controller;
    }

    setController(controller) {
        this.controller = controller;
    }

    getActionName() {
        return this.actionName;
    }

    setActionName(name) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        this.actionName = name;
    }

    getPath() {
        return this.path;
    }

    setPath(path) {
        if (!(typeof path === 'string')) {
            throw new TypeError("Value of argument \"path\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(path));
        }

        this.path = path;
    }

    getUrlMatcherId() {
        return this.urlMatcherId;
    }

    setUrlMatcherId(id) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        this.urlMatcherId = id;
    }

    getMethods() {
        return this.methods.slice(0);
    }

    addMethod(name) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        var normalizedName = name.toUpperCase();

        if (!(typeof normalizedName === 'string')) {
            throw new TypeError("Value of variable \"normalizedName\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(normalizedName));
        }

        if (this.methods.indexOf(normalizedName) !== -1) {
            return;
        }

        this.methods.push(normalizedName);
    }
}
exports.default = Route;

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