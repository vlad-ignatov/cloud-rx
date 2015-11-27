import Boom                 from 'boom'
import CollectionController from './CollectionController'
import Meds                 from '../models/Users'
import { route, auth }      from '../lib/decorators'
import crypto               from 'crypto'
import bcrypt               from 'bcrypt'



class UsersController extends CollectionController
{
    constructor() {
        super(Meds.Collection)
    }

    /**
     * Browse the registered users. This is only exposed to admins and managers
     */
    @auth('admin', 'manager')
    @route('GET', '/api/users')
    index(request, reply) {
        super.index(request.query, (err, results) => reply(err || results))
    }

    /**
     * Create new user. This is only exposed to everyone because it does the
     * new user account registrations
     */
    @auth('none')
    @route('POST', '/api/users')
    register(request, reply) {
        reply(Meds.Model.register(request.payload))
    }

    /**
     * Delete an user. This destroys the user account and all the related data.
     * Note that this is not available for "admin" so that the administrator
     * cannot accidentally delete his account and leave the system without
     * admin users (just a temp. solution)
     */
    @auth('user', 'manager')
    @route('DELETE', '/api/users/:id')
    unregister(request, reply) {
        super.remove(
            request.params.id,
            (err, result) => reply(err || result)
        )
    }

    /**
     * First searches for such user by username. Then (if found) compares his
     * password. Finally sets a session "sid" cookie and replies with the user
     * as JSON
     */
    @auth('none')
    @route('POST', '/api/login')
    logIn(request, reply) {
        setTimeout(() => {
            let { username, password } = request.payload
            super.get({ data: { username }}, (err, user) => {

                // No such username
                if (err || !user) {
                    return reply(Boom.notAcceptable("Wrong username or password"));
                }

                // No such password
                if (!bcrypt.compareSync(password, user.get('password'))) {
                    return reply(Boom.notAcceptable("Wrong username or password"));
                }

                // Generate SID and update the user in DB
                const SID = crypto.randomBytes(48).toString('hex');
                user.save({ sid: SID }).then(
                    () => {
                        reply(user).state('sid', SID, {
                            isSecure  : !!request.server.settings.app.tls,
                            isHttpOnly: true
                        })
                    },
                    err => reply(err)
                )
            })
        }, 1000)
    }

    /**
     * Just unsets the sesion cookie and replies with an empty object as JSON
     */
    @auth('none')
    @route('GET', '/api/logout')
    logOut(request, reply) {
        reply({}).unstate('sid')
    }
}


module.exports = UsersController;
