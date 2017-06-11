"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Route = class Route {
  constructor() {
    this.methods = [];
    this.urlMatcherId = "standard";
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getControllerId() {
    return this.controllerId;
  }

  setControllerId(id) {
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
    this.actionName = name;
  }

  getPath() {
    return this.path;
  }

  setPath(path) {
    this.path = path;
  }

  getUrlMatcherId() {
    return this.urlMatcherId;
  }

  setUrlMatcherId(id) {
    this.urlMatcherId = id;
  }

  getMethods() {
    return this.methods.slice(0);
  }

  addMethod(name) {
    var normalizedName = name.toUpperCase();

    if (this.methods.indexOf(normalizedName) !== -1) {
      return;
    }

    this.methods.push(normalizedName);
  }
};
exports.default = Route;
module.exports = exports["default"];