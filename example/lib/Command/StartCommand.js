"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var StartCommand = class StartCommand {
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
        defaultServer.start(8081);

        console.info("Example started");
    }
};
exports.default = StartCommand;
module.exports = exports["default"];