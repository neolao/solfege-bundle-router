"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class StartCommand {
    constructor(serverFactory) {
        this.serverFactory = serverFactory;
    }

    getName() {
        return "example:start";
    }

    getDescription() {
        return "Start example";
    }

    *execute() {
        var defaultServer = this.serverFactory.create();
        defaultServer.start(8080);

        console.info("Example started");
    }
}
exports.default = StartCommand;
module.exports = exports['default'];