var http = require('http');
var solfege = require('solfegejs');
var Router = require('../bundle/Router');
var mochaSetup = require('./mochaSetup');
var expect = require('chai').expect;
var should = require('chai').should();

/**
 * Test the Router class
 */
describe('Router', function()
{
    var Application = solfege.kernel.Application;
    var application;

    /**
     * Initialize the test suite
     */
    before(function()
    {
        // Initialize the application
        application = new Application(__dirname);

    });


    /**
     * Test the getRoute() function
     */
    describe('#getRoute()', function()
    {
        // Standard handler - simple url
        it('should get route from a simple URL', function*()
        {
            // Add the router bundle, configure it and start the application
            var router = new Router;
            var routes = [
                { url: '/' },
                { url: '/foo' },
                { url: '/bar-ok' }
            ];
            application.addBundle('router', router);
            //application.start();

            // Test requets
            var result = yield router.getRoute(routes, { url: '/' }, {});
            expect(routes).to.contain(result);
            result = yield router.getRoute(routes, { url: '/foo' }, {});
            expect(routes).to.contain(result);
            result = yield router.getRoute(routes, { url: '/bar-ok' }, {});
            expect(routes).to.contain(result);
        });

        // Standard handler - URL with query string
        it('should get route from an URL with query string', function*()
        {
            // Add the router bundle, configure it and start the application
            var router = new Router;
            var routes = [
                { url: '/' },
                { url: '/foo' },
                { url: '/bar-ok' }
            ];
            application.addBundle('router', router);
            application.start();

            // Test requets
            var result = yield router.getRoute(routes, { url: '/?page=1' }, {});
            expect(routes).to.contain(result);
            result = yield router.getRoute(routes, { url: '/foo?start=abcd' }, {});
            expect(routes).to.contain(result);
            result = yield router.getRoute(routes, { url: '/bar-ok?' }, {});
            expect(routes).to.contain(result);
        });


        // Standard handler - Same URL but different HTTP method
        it('should get route from an URL with a specific policy', function*()
        {
            // Add the router bundle, configure it and start the application
            var router = new Router;
            var routes = [
                {
                    url: '/foo',
                    action: 'a',
                    policies: ['methodIsGet']
                },
                {
                    url: '/foo',
                    action: 'b',
                    policies: ['methodIsPost']
                }
            ];
            application.addBundle('router', router);
            application.start();

            // Test requets
            yield router.setApplication(application);
            var result = yield router.getRoute(routes, { url: '/foo', method: 'GET' }, {});
            expect(result.action).to.equal('a');
            result = yield router.getRoute(routes, { url: '/foo', method: 'POST' }, {});
            expect(result.action).to.equal('b');
        });

    });
});

