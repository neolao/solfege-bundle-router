/* @flow */
import type Routes from "./src/Routes"
import Route from "./src/Route"
import type {RequestInterface, ResponseInterface} from "solfegejs-server/interface"

/**
 * Loader interface for routes
 */
export interface RoutesLoaderInterface
{
    /**
     * Load file
     *
     * @param   {string}    filePath    File path
     * @return  {Routes}                Routes container
     */
    load(filePath:string):Generator<*,Routes,void>
}

/**
 * Routes URL matcher
 */
export interface UrlMatcherInterface
{
    /**
     * Check if the request matches the route
     *
     * @param   {RequestInterface}  request     HTTP request
     * @param   {ResponseInterface} response    HTTP response
     * @param   {Route}             route       Route
     * @return  {Boolean}                       true if the request matches the route, false otherwise
     */
    match(request:RequestInterface, response:ResponseInterface, route:Route):boolean;
}
