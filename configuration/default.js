module.exports = {
    // The default handler
    // - standard
    // - regexp
    handler: 'standard',

    // The policies
    policies: {
        nop: '@this.policy.nop',
        methodIsConnect: '@this.policy.methodIsConnect',
        methodIsDelete: '@this.policy.methodIsDelete',
        methodIsGet: '@this.policy.methodIsGet',
        methodIsHead: '@this.policy.methodIsHead',
        methodIsOptions: '@this.policy.methodIsOptions',
        methodIsPost: '@this.policy.methodIsPost',
        methodIsPut: '@this.policy.methodIsPut',
        methodIsTrace: '@this.policy.methodIsTrace'
    },

    // The routes
    // Note: The order is important
    routes: [
        {
            id: 'home',
            handler: 'standard', // Optional (string or object)
            url: '/',
            controller: '@this.controller.Home',
            action: 'index',
            policies: [] // Optional
        },
        {
            id: 'hello',
            url: '/hello/:name/iam/:age',
            controller: '@this.controller.Home',
            action: 'hello',
            policies: ['nop']
        }

    ]
};
