"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _Route = require("../Route");

var _Route2 = _interopRequireDefault(_Route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Standard = class Standard {
    constructor() {}

    match(request, response, route) {
        var requestUrl = request.getUrl();
        var routePath = route.getPath();
        var requestObject = _url2.default.parse(requestUrl, true);

        var routeSplitted = routePath.split(/:[a-zA-Z]+/);
        var pattern = new RegExp("^" + routeSplitted.join("([^/]+)") + "$");

        if (typeof requestObject.pathname === "string" && pattern.test(requestObject.pathname)) {
            var parameterValues = pattern.exec(requestObject.pathname);
            parameterValues.shift();
            var parameterCount = parameterValues.length;
            var parameterPattern = /:[a-zA-Z]+/g;
            var parameterNames = routePath.match(parameterPattern);
            if (parameterNames) {
                for (var index = 0; index < parameterCount; ++index) {
                    var parameterName = parameterNames[index].substr(1);
                    var parameterValue = parameterValues[index];

                    request.setParameter(parameterName, parameterValue);
                }
            }

            return true;
        }

        return false;
    }

};
exports.default = Standard;
module.exports = exports["default"];