"use strict";

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _solfegejsServer = require("solfegejs-server");

var _solfegejsServer2 = _interopRequireDefault(_solfegejsServer);

var _Bundle = require("../../lib/Bundle");

var _Bundle2 = _interopRequireDefault(_Bundle);

var _Bundle3 = require("./Bundle");

var _Bundle4 = _interopRequireDefault(_Bundle3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create application
var application = _solfegejs2.default.factory();
application.addBundle(new _solfegejsServer2.default());
application.addBundle(new _Bundle2.default());
application.addBundle(new _Bundle4.default());

// Load configuration
application.loadConfiguration(__dirname + "/config/default.yml");

// Start application
var parameters = process.argv;
parameters.shift();
parameters.shift();
application.start(parameters);