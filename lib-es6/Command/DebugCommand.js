import Table from "easy-table"
import colors from "colors"
import RouterMiddleware from "../middlewares/RouterMiddleware"

/**
 * Debug command
 */
export default class DebugCommand
{
    /**
     * Constructor
     *
     * @param   {object}    serverFactory   HTTP server factory
     */
    constructor(serverFactory)
    {
        this.serverFactory = serverFactory;
    }

    /**
     * Get command name
     *
     * @return  {string}    Command name
     */
    getName()
    {
        return "router:debug";
    }

    /**
     * Get command description
     *
     * @return  {string}    Command description
     */
    getDescription()
        {
        return "Debug the routing";
    }

    /**
     * Execute the command
     */
    *execute()
    {
        let serverNames = this.serverFactory.getServerNames();

        let rows = [];
        for (let serverName of serverNames) {
            let serverRows = yield this.displayServerRoutes(serverName);
            rows = rows.concat(serverRows);
        }

        console.log(Table.print(rows, {
            serverName: {
                name: colors.yellow("Server")
            },
            id: {
                name: colors.yellow("Id")
            },
            methods: {
                name: colors.yellow("Methods")
            },
            path: {
                name: colors.yellow("Path")
            },
            controller: {
                name: colors.yellow("Controller")
            },
            action: {
                name: colors.yellow("Action")
            }
        }));
    }

    /**
     * Display server routes
     *
     * @param   {string}    serverName  Server name
     * @return  {Array}                 Routes
     */
    *displayServerRoutes(serverName:string)
    {
        // Get router middleware
        let middlewares = this.serverFactory.getMiddlewares(serverName);
        let routerMiddleware;
        for (let middleware of middlewares) {
            if (middleware.instance instanceof RouterMiddleware) {
                routerMiddleware = middleware.instance;
                break;
            }
        }
        if (!routerMiddleware) {
            return;
        }

        // Get routes
        const routes = routerMiddleware.getRoutes();
        const list = routes.getList();

        // Build a table rows
        let rows = [];
        for (let route of list) {
            let controllerName = "";
            const controllerId = route.getControllerId();
            const controller = route.getController();
            if (controllerId) {
                controllerName = controllerId;
            } else if (typeof controller === "object" && typeof controller.constructor === "function") {
                controllerName = controller.constructor.name;
            }

            let methodNames = "*";
            const methods = route.getMethods();
            if (methods.length > 0) {
                methodNames = methods.join(", ");
            }

            rows.push({
                serverName:     serverName,
                id:             route.getId(),
                methods:        methodNames,
                path:           route.getPath(),
                controller:     controllerName,
                action:         route.getActionName()
            });
        }

        return rows;
    }
}
