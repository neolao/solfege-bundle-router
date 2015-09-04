/**
 * The HTTP Method must be "HEAD"
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 * @return  {Boolean}                                       true
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function* (request, response) {
  return request.method === "HEAD";
};

module.exports = exports["default"];