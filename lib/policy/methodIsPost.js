"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function* (request, response) {
    if (request.method === "OPTIONS") {
        return true;
    }

    return request.method === "POST";
};

module.exports = exports['default'];