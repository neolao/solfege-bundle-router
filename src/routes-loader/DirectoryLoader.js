/* @flow */
import {fn as isGenerator} from "is-generator"
import Routes from "../Routes"
import Route from "../Route"
import type {ContainerInterface} from "solfegejs-dependency-injection/interface"

/**
 * Directory loader for routes
 */
export default class DirectoryLoader
{
    /**
     * SolfegeJS service container
     */
    container:ContainerInterface;

    /**
     * Constructor
     *
     * @param   {ContainerInterface}    container   SolfegeJS service container
     */
    constructor(container:ContainerInterface)
    {
        this.container = container;
    }

    /**
     * Load directory containing controllers
     *
     * @param   {string}    path        Directory path
     * @return  {Routes}                Routes container
     */
    *load(path:string):Generator<void,Routes,void>
    {
        let routes = new Routes;

        return routes;
    }

    /**
     * Build route
     *
     * @param   {string}    id      Route id
     * @param   {object}    config  Route configuration
     * @return  {Route}             Route instance
     */
    *buildRoute(id:string, config:Object):Generator<*,Route,void>
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
