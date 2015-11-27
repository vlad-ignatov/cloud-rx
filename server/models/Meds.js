const Base   = require("./BaseModel.js")
const Fs     = require("fs")
const Crypto = require("crypto")
const Lib    = require("../lib")
const CFG    = require("../config")
const Path   = require("path")
const Joi    = require('joi')
const Boom   = require('boom')

exports.Model = Base.Model.extend({
    tableName: 'meds',
    hasTimestamps: true,

    /**
     * Attaches the listeners needed to keep the image file in sync with the
     * DB record
     */
    initialize() {
        Base.Model.prototype.initialize.apply(this, arguments);
        this.__pendingBuffers = {};
        
        this.on('creating', (model, attrs) => {
            let data = Joi.validate(
                attrs,
                Joi.object().keys({
                    name        : Joi.string().min(3).max(255).required(),
                    rxnorm      : Joi.string().max(20).allow([null, '']).default(null),
                    NDC         : Joi.string().max(50).allow([null, '']).default(null),
                    dose        : Joi.string().allow([null, '']).default(null),
                    instructions: Joi.string().max(255).allow([null, '']).default(null),
                    manufacturer: Joi.string().max(255).allow([null, '']).default(null),
                    description : Joi.string().allow([null, '']).default(null)
                }),
                {
                    allowUnknown : true,
                    stripUnknown : true
                }
            );
    
            if (data.error) {
                throw Boom.badData(data.error);
            }
            
            this.set(data.value);
        });
    },

    format(attrs) {

        // Catches INSERT/UPDATE attempts and scans them to see if an image
        // stream is provided. If so, stores it in memory untill the query is
        // complete (because we need to know the insert id) and then "onSaved"
        // handler will use it to write the associated image on the disk.
        if (attrs.image) {
            let image = attrs.image;
            delete attrs.image;

            if (image.hapi && image.hapi.filename) {
                const key = Crypto.randomBytes(16).toString('hex');
                this.__pendingBuffers[key] = image;

                this.once('saved', (model) => {
                    return new Promise((resolve, reject) => {
                        if (this.__pendingBuffers[key]) {
                            Lib.medThumbnail(
                                this.__pendingBuffers[key],
                                model.id,
                                (err) => {
                                    if (err) {
                                        return reject(err)
                                    }
                                    resolve()
                                }
                            )
                            delete this.__pendingBuffers[key]
                            model.unset('image')
                        }
                    })
                })
            }
        }

        return attrs;
    },

    toJSON() {
        let json = Base.Model.prototype.toJSON.apply(this, arguments)
        let cfg  = CFG.app.uploads.meds
        let def  = cfg.defaultImage.replace(
            Path.join(CFG.app.root, 'client/www/'),
            '/'
        )
        let map  = {
            '/'      : 'small_image',
            '/orig/' : 'big_image'
        }

        for (let dir in map) {
            let key = map[dir]
            json[key] = def
            try {
                let stats = Fs.statSync(
                    `${cfg.dest}${dir}${this.id}.${cfg.extension}`
                )
                if (stats.isFile()) {
                    json[key] = `/img/meds${dir}${this.id}.${cfg.extension}`
                }
            } catch (ex) {
                // ignore
            }
        }

        return json;
    }
});

exports.Collection = Base.Collection.extend({
    model: exports.Model
});
