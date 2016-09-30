import Route from "./Route";

/**
 * Routes container
 */
export default class Routes
{
    /**
     * Constructor
     */
    constructor()
    {
        this.list = [];
    }

    /**
     * Add routes to this container
     *
     * @param   {Routes}    routes  Routes container
     */
    addRoutes(routes:Routes)
    {
        let list = routes.getList();
        for (let route of list) {
            if (route instanceof Route === false) {
                continue;
            }
            this.addRoute(route);
        }
    }

    /**
     * Add route
     *
     * @param   {Route}     route   Route instance
     */
    addRoute(route:Route)
    {
        let routeId = route.getId();
        this.list.push(route);
    }

    /**
     * Get route by its id
     *
     * @param   {string}    id  Route identifier
     * @return  {Route}         Route instance
     */
    getRoute(id:string)
    {
        for (let route of this.list) {
            if (route.getId() === id) {
                return route;
            }
        }
        return null;
    }

    /**
     * Get route list
     *
     * @return  {Array}         Route list
     */
    getList()
    {
        return this.list;
    }
}
