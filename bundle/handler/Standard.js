var solfege = require('solfegejs');

/**
 * The standard routes handler
 */
var Standard = solfege.util.Class.create(function()
{

}, 'solfege.bundle.router.handler.Standard');
var proto = Standard.prototype;

/**
 * Check if the request matches the route
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 * @param   {Object}                            route       The route
 * @return  {Boolean}                                       true if the request matches the route, false otherwise
 */
proto.match = function(request, response, route)
{
    var nodeUrl = require('url');
    var routeUrl = route.url;
    var requestObject = nodeUrl.parse(request.url, true);

    // Build the pattern
    var routeSplitted = routeUrl.split(/:[a-zA-Z]+/);
    var pattern = new RegExp('^' + routeSplitted.join('([^/]+)') + '$');

    if (pattern.test(requestObject.pathname)) {
        // The request matches the route

        // Set the parameter values
        var parameterValues = pattern.exec(requestObject.pathname);
        parameterValues.shift();
        var parameterCount = parameterValues.length;
        var parameterPattern = /:[a-zA-Z]+/g;
        var parameterNames = routeUrl.match(parameterPattern);
        for (var index = 0; index < parameterCount; ++index) {
            var parameterName = parameterNames[index].substr(1);
            var parameterValue = parameterValues[index];

            request.setParameter(parameterName, parameterValue);
        }

        return true;
    }

    // The request does not match the route
    return false;
};

module.exports = Standard;
