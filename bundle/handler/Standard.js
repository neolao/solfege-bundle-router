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
    var url = route.url;

    // Build the pattern
    var routeSplitted = url.split(/:[a-zA-Z]+/);
    var pattern = new RegExp('^' + routeSplitted.join('([^/]+)') + '$');

    if (pattern.test(request.url)) {
        // The request matches the route

        // Set the parameter values
        var parameterValues = pattern.exec(request.url);
        parameterValues.shift();
        var parameterCount = parameterValues.length;
        var parameterPattern = /:[a-zA-Z]+/g;
        var parameterNames = url.match(parameterPattern);
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
