function IndexController() {}

IndexController.register = function(server) {
    server.route({
        method: 'GET',
        path  : '/',
        config: {
            auth: false,
            handler: {
                file : server.settings.app.root + "/client/www/index.html"
            }
        }
    });
};

module.exports = IndexController;
