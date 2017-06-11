"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DefaultController = class DefaultController {
    *index(request, response) {
        console.log("Homepage");
    }

    *contact(request, response) {
        console.log("Contact");

        response.body = "Contact page";
    }
};
exports.default = DefaultController;
module.exports = exports["default"];