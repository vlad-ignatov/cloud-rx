"use strict";

var knex      = require('../lib/knex.js'),
    bookshelf = require('bookshelf')(knex),
    Joi       = require('joi'),
    Boom      = require('boom');

// Base Model
exports.Model = bookshelf.Model.extend({

    // MUST shadow this (maybe with own props) in sub classes!
    hiddenAttributes : [],
    validators: {},

    // format(data) {
    //     var out = Joi.validate(
    //         data,
    //         Joi.object().keys(this.validators),
    //         {
    //             allowUnknown : true,
    //             stripUnknown : true
    //         }
    //     );
    //
    //     if (out.error) {
    //         throw Boom.badData(out.error)
    //     }
    //
    //     return out.value
    // },

    validate(schema, data, options) {
        return Joi.validate(
            data || this.toJSON({ shallow: true, showHidden: true }),
            Joi.object().keys(schema || this.validators),
            options || {
                allowUnknown : true,
                stripUnknown : true
            }
        );
    },

    toJSON(options) {
        var json = bookshelf.Model.prototype.toJSON.call(this, options), key;
        if (!options || !options.showHidden) {
            for (key in json) {
                if (this.hiddenAttributes.indexOf(key) > -1) {
                    delete json[key];
                }
            }
        }
        return json;
    }
});

// Base Collection
exports.Collection = bookshelf.Collection.extend();
