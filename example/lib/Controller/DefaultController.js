"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Default controller
 */
class DefaultController {
  /**
   * Homepage
   *
   * @param   {Request}   request     HTTP request
   * @param   {Response}  response    HTTP response
   */
  *index(request, response) {
    console.log("Homepage");
  }
}
exports.default = DefaultController;
module.exports = exports['default'];