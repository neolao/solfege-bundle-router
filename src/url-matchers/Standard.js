/* @flow */
import nodeUrl from "url"
import Route from "../Route"
import type {RequestInterface, ResponseInterface} from "solfegejs-server/interface"

/**
 * The standard routes URL matcher
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
     * @param   {RequestInterface}  request     HTTP request
     * @param   {ResponseInterface} response    HTTP response
     * @param   {Route}             route       Route
     * @return  {Boolean}                       true if the request matches the route, false otherwise
     */
    match(request:RequestInterface, response:ResponseInterface, route:Route)
    {
        const requestUrl:string = request.getUrl();
        const routePath:string = route.getPath();
        const requestObject:Object = nodeUrl.parse(requestUrl, true);

        // Build the pattern
        const routeSplitted:Array<string> = routePath.split(/:[a-zA-Z]+/);
        const pattern = new RegExp("^" + routeSplitted.join("([^/]+)") + "$");

        if (typeof requestObject.pathname === "string" && pattern.test(requestObject.pathname)) {
            // The request matches the route

            // Set the parameter values
            let parameterValues = pattern.exec(requestObject.pathname);
            parameterValues.shift();
            const parameterCount:number = parameterValues.length;
            const parameterPattern:RegExp = /:[a-zA-Z]+/g;
            const parameterNames = routePath.match(parameterPattern);
            if (parameterNames) {
                for (let index:number = 0; index < parameterCount; ++index) {
                    const parameterName = parameterNames[index].substr(1);
                    const parameterValue = parameterValues[index];

                    request.setParameter(parameterName, parameterValue);
                }
            }

            return true;
        }

        // The request does not match the route
        return false;
    }

}

