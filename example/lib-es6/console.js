import solfege from "solfegejs";
import ServerBundle from "solfegejs-server";
import RouterBundle from "../../lib/Bundle";
import MyBundle from "./Bundle";

// Create application
let application = solfege.factory();
application.addBundle(new ServerBundle);
application.addBundle(new RouterBundle);
application.addBundle(new MyBundle);

// Load configuration
application.loadConfiguration(`${__dirname}/config/default.yml`);

// Start application
let parameters = process.argv;
parameters.shift();
parameters.shift();
application.start(parameters);
