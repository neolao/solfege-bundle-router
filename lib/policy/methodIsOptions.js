"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function* (request, response) {
  return request.method === "OPTIONS";
};

module.exports = exports['default']; /**
                                      * The HTTP Method must be "OPTIONS"
                                      *
                                      * @param   {solfege.bundle.server.Request}     request     The request
                                      * @param   {solfege.bundle.server.Response}    response    The response
                                      * @return  {Boolean}                                       true
                                      */