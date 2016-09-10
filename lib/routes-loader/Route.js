"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Route definition
 */
class Route {
  /**
   * Constructor
   */
  constructor() {
    // Initialize properties
    this.id;
    this.controller;
    this.actionName;
    this.path;
    this.urlMatcherId = "standard";
  }

  /**
   * Get identifier
   *
   * @return  {string}    Identifier
   */
  getId() {
    return this.id;
  }

  /**
   * Set identifier
   *
   * @param   {string}    id      Identifier
   */
  setId(id) {
    if (!(typeof id === 'string')) {
      throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
    }

    this.id = id;
  }

  /**
   * Get controller instance
   *
   * @return  {object}    Controller instance
   */
  getController() {
    return this.controller;
  }

  /**
   * Set controller instance
   *
   * @param   {object}    controller  Controller instance
   */
  setController(controller) {
    this.controller = controller;
  }

  /**
   * Get action name
   *
   * @return  {string}                Action name
   */
  getActionName() {
    return this.actionName;
  }

  /**
   * Set action name
   *
   * @param   {string}    name        Method name
   */
  setActionName(name) {
    if (!(typeof name === 'string')) {
      throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
    }

    this.actionName = name;
  }

  /**
   * Get path
   *
   * @return  {string}                Path
   */
  getPath() {
    return this.path;
  }

  /**
   * Set path
   *
   * @param   {string}    path        Path
   */
  setPath(path) {
    if (!(typeof path === 'string')) {
      throw new TypeError("Value of argument \"path\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(path));
    }

    this.path = path;
  }

  /**
   * Get URL matcher identifier
   *
   * @return  {string}                Matcher identifier
   */
  getUrlMatcherId() {
    return this.urlMatcherId;
  }

  /**
   * Set URL matcher identifier
   *
   * @param   {string}    id          Matcher identifier
   */
  setUrlMatcherId(id) {
    if (!(typeof id === 'string')) {
      throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
    }

    this.urlMatcherId = id;
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