/* @flow */
import {fn as isGenerator} from "is-generator"
import type {RequestInterface, ResponseInterface, MiddlewareInterface} from "solfegejs-server/interface"
import type Route from "../Route"
import type {RoutesLoaderInterface, UrlMatcherInterface} from "../../interface"
import Routes from "../Routes"
import StandardUrlMatcher from "../url-matchers/Standard"

/**
 * Router middleware
 */
export default class RouterMiddleware implements MiddlewareInterface
{
    /**
     * Routes
     */
    routes:Routes;

    /**
     * URL matchers
     */
    urlMatchers:Object;

    /**
     * Constructor
     */
    constructor()
    {
        // Initialize routes
        this.routes = new Routes;

        // Initialize URL matchers
        // And add the standard matcher
        this.urlMatchers = {};
        this.addUrlMatcher("standard", new StandardUrlMatcher);
    }

    /**
     * Add URL matcher
     *
     * @param   {string}                name        Matcher name
     * @param   {UrlMatcherInterface}   urlMatcher  Matcher instance
     */
    addUrlMatcher(name:string, urlMatcher:UrlMatcherInterface):void
    {
        this.urlMatchers[name] = urlMatcher;
    }

    /**
     * Indicatesthat the URL matcher exists
     *
     * @param   {string}    name        Matcher name
     * @return  {boolean}               true if the matcher exists, false otherwise
     */
    hasUrlMatcher(name:string)
    {
        return this.urlMatchers.hasOwnProperty(name);
    }

    /**
     * Get URL matcher
     *
     * @param   {string}    name        Matcher name
     * @return  {object}                Matcher instance
     */
    getUrlMatcher(name:string)
    {
        return this.urlMatchers[name];
    }

    /**
     * Load routes from path
     *
     * @param   {RoutesLoaderInterface} loader      Routes loader
     * @param   {string}                path        Routes path
     */
    *loadRoutes(loader:RoutesLoaderInterface, path:string):Generator<*,void,*>
    {
        let routes = yield loader.load(path);

        // Add loaded routes to the main routes
        this.routes.addRoutes(routes);
    }

    /**
     * Get routes
     *
     * @return  {Routes}    Routes instance
     */
    getRoutes()
    {
        return this.routes;
    }

    /**
     * Handle a request
     *
     * @param   {RequestInterface}  request     HTTP request
     * @param   {ResponseInterface} response    HTTP response
     * @param   {object}            next        Next middleware
     */
    *handle(request:RequestInterface, response:ResponseInterface, next:*):Generator<*,*,*>
    {
        let routes = this.routes.getList();

        // Dispatch an event
        // Note: For example, you can override the routes for this request
        //yield this.emit(Router.EVENT_ROUTES, request, response, routes);

        // Check the routes that match the URL and policies
        let route = yield this.getRoute(routes, request, response);
        if (!route) {
            yield *next;
            return;
        }

        // Create the controller instance
        let controller = route.getController();
        if (!controller) {
            yield *next;
            return;
        }

        // Execute the action of the selected controller
        let actionName = route.getActionName();
        let action = controller[actionName];
        if (!isGenerator(action)) {
            throw new Error(
                `Invalid action "${route.action}" in the route "${route.id}".
                 You must select a generator function.`
            );
        }

        yield action.call(controller, request, response);

        // Execute the next middleware
        yield *next;
    }

    /**
     * Get the route that match the request and validate the policies
     *
     * @private
     * @param   {Array}             routes      Routes
     * @param   {RequestInterface}  request     HTTP request
     * @param   {ResponseInterface} response    HTTP response
     * @return  {Object}                        The matching route
     */
    *getRoute(routes:Array<Route>, request:RequestInterface, response:ResponseInterface):Generator<*,*,void>
    {
        // Check the routes that match the URL
        let route;
        let nextRoute = this.getNextRoute(routes, request, response);
        while ((route = nextRoute.next().value)) {
            // Apply policies
            let policiesResult = null;
            policiesResult = yield this.applyPolicies(route, request, response);
            if (!policiesResult) {
                continue;
            }

            return route;
        }

        return null;
    }

    /**
     * Get the route that match the request
     *
     * @private
     * @param   {Array}             routes      Routes
     * @param   {RequestInterface}  request     HTTP request
     * @param   {ResponseInterface} response    HTTP response
     * @return  {Object}                        Matching route
     */
    *getNextRoute(routes:Array<Route>, request:RequestInterface, response:ResponseInterface):Generator<*,*,void>
    {
        // Find the route
        let routeCount = routes.length;
        let routeIndex;
        let route;
        for (routeIndex = 0; routeIndex < routeCount; ++routeIndex) {
            route = routes[routeIndex];

            // Get the URL matcher to use
            let urlMatcherId = route.getUrlMatcherId();
            if (!this.hasUrlMatcher(urlMatcherId)) {
                urlMatcherId = "standard";
            }
            let urlMatcher = this.getUrlMatcher(urlMatcherId);

            // If the route matches the request, then stop here
            let matched = urlMatcher.match(request, response, route);
            if (matched) {
                yield route;
            }
        }
    }

    /**
     * Apply the policies
     *
     * @private
     * @param   {Route}             route       Route
     * @param   {RequestInterface}  request     HTTP request
     * @param   {ResponseInterface} response    HTTP response
     */
    *applyPolicies(route:Route, request:RequestInterface, response:ResponseInterface):Generator<*,*,*>
    {
        /*
        // Get the available policies
        let availablePolicies = this.configuration.policies || [];

        // Get the policies to apply
        let policies = route.policies || [];

        // Apply the policies
        let total = policies.length;
        let index;
        for (index = 0; index < total; ++index) {
            let policy = policies[index];

            // The policy is a string, check the available policies
            if ("string" === typeof policy && availablePolicies.hasOwnProperty(policy)) {
                policy = availablePolicies[policy];
            }

            // The policy is a string, check if it is a solfege URI
            if ("string" === typeof policy) {
                policy = this.application.resolveSolfegeUri(policy, this);
            }

            // Check if the policy is a generator function
            if ("function" !== typeof policy || "GeneratorFunction" !== policy.constructor.name) {
                continue;
            }

            // Execute the policy
            let policyResult = yield policy(request, response);
            if (!policyResult) {
                return false;
            }
        }
        */

        return true;
    }
}
