var Base = require("./BaseModel.js"),
    Joi  = require('joi'),
    Boom = require('boom');

exports.Model = Base.Model.extend({
    tableName: 'users',
    hasTimestamps: true,
    hiddenAttributes: ['password', 'sid'],
    validators: {
        id       : Joi.any().default(null),
        username : Joi.string().min(3).max(30).required(),
        name     : Joi.string(),
        email    : Joi.string().email(),
        password : Joi.string(),
        password2: Joi.string().optional().strip(),
        role     : Joi.string().allow(['user', 'manager', 'admin']).default('user'),
        sid      : Joi.string().optional().default(null)
    }
}, {
    register(data) {
        /*
        table.string('name', 100).notNullable().comment('full name');
        table.string('email', 100).notNullable().unique();
        table.string('username', 20).notNullable().unique();
        table.string('password', 255).notNullable();
        table.enu('role', ['user','manager','admin']).notNullable().defaultTo('user');
        table.string('sid', 255).nullable().defaultTo(null);
        */
        var pass2 = data.password2

        data = Joi.validate(
            data,
            Joi.object().keys({
                username : Joi.string().min(3).max(20).required(),
                name     : Joi.string().min(3).max(100).required(),
                email    : Joi.string().email().max(100).required(),
                password : Joi.string().max(255).required(),
                password2: Joi.string().strip()
            }, {
                allowUnknown : true,
                stripUnknown : true
            })
        );

        if (data.error) {
            throw Boom.badData(data.error)
        }

        if (pass2 !== data.value.password) {
            throw Boom.badData('Passwords do not match')
        }

        return new exports.Model()

        // check for duplicates
        .query({
            where  : { username: data.value.username },
            orWhere: { email   : data.value.email }
        })
        .fetch()
        .then(function(model) {
            if (model) {
                if (model.get('username') === data.value.username) {
                    throw Boom.badData('This username is not available')
                }
                if (model.get('email') === data.value.email) {
                    throw Boom.badData('This email is not available')
                }
            }
        })
        .then(() => new exports.Model(data.value).save());
    }
});

exports.Collection = Base.Collection.extend({
    model: exports.Model
});
