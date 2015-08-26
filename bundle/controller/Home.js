"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

/**
 * The home controller
 *
 * @class   solfege.bundle.router.controller.Home
 */

var Home = (function () {
  /**
   * Constructor
   */

  function Home() {
    _classCallCheck(this, Home);
  }

  /**
   * Main action
   *
   * @public
   * @param   {solfege.bundle.server.Request}     request     The request
   * @param   {solfege.bundle.server.Response}    response    The response
   */

  _createClass(Home, [{
    key: "index",
    value: function* index(request, response) {
      response.body = "Homepage";
    }

    /**
     * Hello action
     *
     * @public
     * @param   {solfege.bundle.server.Request}     request     The request
     * @param   {solfege.bundle.server.Response}    response    The response
     */
  }, {
    key: "hello",
    value: function* hello(request, response) {
      var name = request.getParameter("name");
      var age = request.getParameter("age");

      response.body = "Hello " + name + ", I am " + age + ".";
    }
  }]);

  return Home;
})();

exports["default"] = Home;
module.exports = exports["default"];