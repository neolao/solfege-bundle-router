var solfege = require('solfegejs');

/**
 * The home controller
 */
var Home = solfege.util.Class.create(function()
{

}, 'solfege.bundle.router.controller.Home');
var proto = Home.prototype;

/**
 * Main action
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 */
proto.index = function*(request, response)
{
    response.body = 'Homepage';
};

/**
 * Hello action
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 */
proto.hello = function*(request, response)
{
    var name = request.getParameter('name');
    var age = request.getParameter('age');

    response.body = 'Hello ' + name + ', I am ' + age + '.';
};


module.exports = Home;
