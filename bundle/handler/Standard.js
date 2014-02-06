var solfege = require('solfegejs');

/**
 * The standard routes handler
 */
var Standard = solfege.util.Class.create(function()
{

}, 'solfege.bundle.router.handler.Standard');
var proto = Standard.prototype;


proto.match = function(request, response, route)
{
};

module.exports = Standard;
