exports.register = function(server) {
    server.route({
        method : 'GET',
        path   : '/{path*}',
        config : {
            auth: false,
            handler: {
                directory: {
                    path   : './',
                    listing: true,
                    index  : true
                }
            }
        }
    });
}
