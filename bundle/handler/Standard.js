"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

/**
 * The standard routes handler
 *
 * @class   solfege.bundle.router.handler.Standard
 */

var Standard = (function () {
    /**
     * Constructor
     */

    function Standard() {
        _classCallCheck(this, Standard);
    }

    /**
     * Check if the request matches the route
     *
     * @public
     * @param   {solfege.bundle.server.Request}     request     The request
     * @param   {solfege.bundle.server.Response}    response    The response
     * @param   {Object}                            route       The route
     * @return  {Boolean}                                       true if the request matches the route, false otherwise
     */

    _createClass(Standard, [{
        key: "match",
        value: function match(request, response, route) {
            var routeUrl = route.url;
            var requestObject = _url2["default"].parse(request.url, true);

            // Build the pattern
            var routeSplitted = routeUrl.split(/:[a-zA-Z]+/);
            var pattern = new RegExp('^' + routeSplitted.join('([^/]+)') + '$');

            if (pattern.test(requestObject.pathname)) {
                // The request matches the route

                // Set the parameter values
                var parameterValues = pattern.exec(requestObject.pathname);
                parameterValues.shift();
                var parameterCount = parameterValues.length;
                var parameterPattern = /:[a-zA-Z]+/g;
                var parameterNames = routeUrl.match(parameterPattern);
                for (var index = 0; index < parameterCount; ++index) {
                    var parameterName = parameterNames[index].substr(1);
                    var parameterValue = parameterValues[index];

                    request.setParameter(parameterName, parameterValue);
                }

                return true;
            }

            // The request does not match the route
            return false;
        }
    }]);

    return Standard;
})();

exports["default"] = Standard;
module.exports = exports["default"];