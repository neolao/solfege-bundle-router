/**
 * The HTTP Method must be "TRACE"
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
    if (request.method === "OPTIONS") {
        return true;
    }

    return request.method === "TRACE";
};

module.exports = exports["default"];