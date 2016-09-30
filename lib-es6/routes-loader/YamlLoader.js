import {fn as isGenerator} from "is-generator";
import configYaml from "config-yaml";
import Routes from "../Routes";
import Route from "../Route";

/**
 * YAML loader for routes
 */
export default class YamlLoader
{
    /**
     * Constructor
     *
     * @param   {object}    container   Solfege service container
     */
    constructor(container)
    {
        this.container = container;
    }

    /**
     * Load YAML file
     *
     * @param   {string}    filePath    YAML file path
     * @return  {Routes}                Routes container
     */
    *load(filePath:string)
    {
        let routes = new Routes;

        let config = configYaml(filePath, {encoding: "utf8"});
        for (let routeId in config) {
            let route = yield this.buildRoute(routeId, config[routeId]);
            routes.addRoute(route);
        }

        return routes;
    }

    /**
     * Build route
     *
     * @param   {string}    id      Route id
     * @param   {object}    config  Route configuration
     * @return  {Route}             Route instance
     */
    *buildRoute(id:string, config)
    {
        let route = new Route;
        route.setId(id);

        // Get controller instance from configuration
        let controllerId = config.controller;
        let controller = yield this.container.resolveParameter(controllerId);
        if (typeof controller !== "object") {
            throw new Error(`Invalid route ${id}, the controller is not a service`);
        }
        route.setControllerId(controllerId);
        route.setController(controller);

        // Get action method name
        let actionName = config.action;
        if (!isGenerator(controller[actionName])) {
            throw new Error(`Invalid route ${id}, the action is not a generator function`);
        }
        route.setActionName(actionName);

        // Get path
        let path = config.path;
        route.setPath(path);

        return route;
    }
}
