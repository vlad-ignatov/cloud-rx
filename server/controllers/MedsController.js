import Boom                    from 'boom'
import CollectionController    from './CollectionController'
import Meds                    from '../models/Meds'
import { route, auth, upload } from '../lib/decorators'

class MedsController extends CollectionController
{
    constructor() {
        super(Meds.Collection)
    }

    /**
     * Get all meds
     */
    @route('GET', '/api/meds')
    index(request, reply) {
        super.index(request.query, (err, results) => reply(err || results))
    }

    /**
     * Get one med by ID
     */
    @route('GET', '/api/meds/{id}')
    find(request, reply) {
        super.get(request.params.id, (err, result) => reply(err || result))
    }

    /**
     * Create new med
     */
    @upload
    @route('POST', '/api/meds')
    create(request, reply) {
        let options = { data: request.payload };
        super.add(options, (err, result) => reply(err || result));
    }

    /**
     * Update a med by ID
     */
    @upload
    @route('PUT', '/api/meds/{id}')
    update(request, reply) {
        super.update({
            id  : request.params.id,
            data: request.payload
        }, (err, model) => {
            if (err) console.log(err);
            reply(err || model);
        });
    }

    /**
     * Delete a med by ID
     */
    @route('DELETE', '/api/meds/{id}')
    delete(request, reply) {
        super.remove(request.params.id, (err, model) => reply(err || model));
    }
}

module.exports = MedsController;
