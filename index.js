require('babel-core/register')({
    optional: ['es7'],
    ignore: /node_modules/
});

var Hapi             = require('hapi');
var cfg              = require('./server/config');
var requireDirectory = require('require-directory');
var Boom             = require('boom');
var User             = require('./server/models/Users')

var server = new Hapi.Server(cfg);

// Main connection
server.connection({
    port   : cfg.app.port,
    host   : cfg.app.host,
    tls    : cfg.app.tls,
    labels : "main"
});

server.auth.scheme('session', function(server, options) {
    return {
        authenticate(request, reply) {
            if (request.state && request.state.sid) {
                new User.Model({
                    sid: request.state.sid
                })
                .fetch({ require: true })
                .then(
                    user => reply.continue({
                        credentials: { sid: request.state.sid },
                        artifacts: user
                    }),
                    () => reply(Boom.unauthorized(null, 'Custom'))
                )
            }
            else {
                reply(Boom.unauthorized(null, 'Custom'))
            }
        }
    }
})

server.auth.strategy('default', 'session', 'required', {});

server.register(require('inert'), function (err) {

    if (err) {
        throw err;
    }

    var controllers = requireDirectory(module, './server/controllers');
    for ( var ctlName in controllers ) {
        if (typeof controllers[ctlName].register == "function") {
            controllers[ctlName].register(server);
        }
    }

    server.start(function(error) {

        if (error) {
            throw error;
        }

        console.log('Server running at:', server.info.uri);
    });
});
