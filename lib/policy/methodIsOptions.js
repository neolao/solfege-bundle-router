"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function* (request, response) {
  return request.method === "OPTIONS";
};

module.exports = exports["default"];