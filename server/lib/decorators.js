import Boom               from 'boom'
import { getActor }       from './'
import { default as CFG } from '../config'

export function route(method, path) {
    return function(target, key, descriptor) {

        if (!target.constructor.__routes__) {
            target.constructor.__routes__ = {}
            target.constructor.register = function(server) {
                for (let name in this.__routes__) {
                    let route = this.__routes__[name]
                    console.log(
                        'Route "%s %s" -> %s::%s',
                        route.method,
                        route.path,
                        this.name,
                        name
                    )
                    server.route(route)
                }
            }
        }

        target.constructor.__routes__[key] = {
            method: method,
            path  : path,
            config: {
                handler: (...args) => new target.constructor()[key](...args)
            }
        }
    };
}

export function upload(target, key, descriptor) {
    var route = target.constructor.__routes__ ?
        target.constructor.__routes__[key] :
        null

    if (!route) {
        throw new Error(
            `Cannot find route for ${target.constructor.name}::${key}. ` +
            `Please make sure that @auth is used before @route.`
        )
    }

    route.config.payload = {
        output   : "stream",
        maxBytes : CFG.app.maxUploadSize,
        parse    : true
    }
}

/**
 * Examples:
 * @auth() -> Anybody who is logged in (same as not useing this decorator at all)
 * @auth('none') -> No auth
 * @auth('user') -> user
 * @auth('admin') -> admin
 * @auth(['admin', 'manager']) -> admin or manager
 * @auth('admin', 'manager') -> admin or manager
 *
 * IMPORTANT! This decoratore must be used before the @route one
 */
export function auth(roles) {
    if (!Array.isArray(roles)) {
        roles = [].slice.call(arguments)
    }

    return function(target, key, descriptor) {
        var route = target.constructor.__routes__ ?
            target.constructor.__routes__[key] :
            null

        if (!route) {
            throw new Error(
                `Cannot find route for ${target.constructor.name}::${key}. ` +
                `Please make sure that @auth is used before @route.`
            )
        }

        // Disable authorization fot this route
        if (roles.length === 1 && roles[0] == 'none') {
            route.config.auth = false
            return
        }

        // Require authorization but accept any authorized user
        if (!roles.length || (roles.length === 1 && !roles[0])) {
            return
        }

        // Look for one of the required roles
        var orig = route.config.handler
        route.config.handler = function(request, reply) {
            if (!request.auth.isAuthenticated) {
                return reply(Boom.forbidden())
            }

            let user = request.auth.artifacts,
                role = user.get('role')

            if (roles.some(r => !r || role === r)) {
                return orig.call(this, request, reply)
            }

            reply(Boom.forbidden())
        }
    }
}
