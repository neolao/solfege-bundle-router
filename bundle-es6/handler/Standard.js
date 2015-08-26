import solfege from "solfegejs";
import nodeUrl from "url";

/**
 * The standard routes handler
 *
 * @class   solfege.bundle.router.handler.Standard
 */
export default class Standard
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    /**
     * Check if the request matches the route
     *
     * @public
     * @param   {solfege.bundle.server.Request}     request     The request
     * @param   {solfege.bundle.server.Response}    response    The response
     * @param   {Object}                            route       The route
     * @return  {Boolean}                                       true if the request matches the route, false otherwise
     */
    match(request, response, route)
    {
        let routeUrl = route.url;
        let requestObject = nodeUrl.parse(request.url, true);

        // Build the pattern
        let routeSplitted = routeUrl.split(/:[a-zA-Z]+/);
        let pattern = new RegExp('^' + routeSplitted.join('([^/]+)') + '$');

        if (pattern.test(requestObject.pathname)) {
            // The request matches the route

            // Set the parameter values
            let parameterValues = pattern.exec(requestObject.pathname);
            parameterValues.shift();
            let parameterCount = parameterValues.length;
            let parameterPattern = /:[a-zA-Z]+/g;
            let parameterNames = routeUrl.match(parameterPattern);
            for (let index = 0; index < parameterCount; ++index) {
                let parameterName = parameterNames[index].substr(1);
                let parameterValue = parameterValues[index];

                request.setParameter(parameterName, parameterValue);
            }

            return true;
        }

        // The request does not match the route
        return false;
    }

}

