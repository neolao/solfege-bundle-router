"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class DefaultController {
  *index(request, response) {
    console.log("Homepage");
  }
}
exports.default = DefaultController;
module.exports = exports['default'];