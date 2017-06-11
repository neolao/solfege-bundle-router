const solfege = require("solfegejs");
const ServerBundle = require("solfegejs-server");
const RouterBundle = require("../lib/Bundle");
const MyBundle = require("./lib/Bundle");

// Create application
let application = solfege.factory([
    new ServerBundle,
    new RouterBundle,
    new MyBundle
]);

// Load configuration
application.loadConfigurationFile(`${__dirname}/config/default.yml`, "yaml");

// Start application
application.start(process.argv.slice(2));
