/**
 * Start command
 */
export default class StartCommand
{
    constructor(serverFactory)
    {
        this.serverFactory = serverFactory;
    }

    getName()
    {
        return "example:start";
    }

    getDescription()
    {
        return "Start example";
    }

    /**
     * Execute the command
     */
    *execute()
    {
        let defaultServer = this.serverFactory.create();
        defaultServer.start(8081);

        console.info("Example started");
    }
}
