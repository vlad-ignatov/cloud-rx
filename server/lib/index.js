const CFG = require('../config')
const Lwip = require('lwip')

/**
 * Returns the int representation of the first argument or the
 * "defaultValue" if the int conversion is not possible.
 * @memberof Utils
 * @param {*} x The argument to convert
 * @param {*} defaultValue The fall-back return value. This is going to be
 *                         converted to integer too.
 * @return {Number} The resulting integer.
 */
export function intVal( x, defaultValue ) {
    var out = parseInt(x, 10);
    if ( isNaN(out) || !isFinite(out) ) {
        out = defaultValue === undefined ? 0 : intVal(defaultValue);
    }
    return out;
}

export function floatVal( x, defaultValue ) {
    var out = parseFloat(x);
    if ( isNaN(out) || !isFinite(out) ) {
        out = defaultValue === undefined ? 0 : floatVal(defaultValue);
    }
    return out;
}

export function uInt( x, defaultValue ) {
    return Math.max(
        intVal( x, defaultValue ),
        0
    );
}

export function bool(x) {
    if (typeof x == "string") {
        x = x.toLowerCase();
        return x && x != "0" && x != "false" && x != "no";
    }
    return !!x;
}

export function getActor(request) {
    if (request.app.actor) {
        return request.app.actor;
    }

    var actor = { role : "guest", data: {}, auth: null };

    if (request.state &&
        request.state.session &&
        request.state.session.sid)
    {
        actor.sid = request.state.session.sid;
    }

    if (request.auth.isAuthenticated &&
        request.auth.credentials &&
        request.auth.credentials.data &&
        request.auth.credentials.data.user)
    {
        actor.data = request.auth.credentials.data.user;
        actor.role = actor.data.role;
        actor.auth = request.auth.credentials.data.auth || null;
    }

    return actor;
}

function streamToBuffer(stream, cb) {
    var buf = [];
    stream.on('data', function(d) {
        buf.push(d);
    });
    stream.on('end', function() {
        cb(Buffer.concat(buf));
    });
}

export function medThumbnail(stream, id, cb) {
    var type = stream.hapi.headers['content-type'].replace(/image\//, ''),
        w    = CFG.app.uploads.meds.thumbnail.width,
        h    = CFG.app.uploads.meds.thumbnail.height,
        ext  = CFG.app.uploads.meds.extension,
        dst  = CFG.app.uploads.meds.dest + '/' + id + '.' + ext,
        orig = CFG.app.uploads.meds.dest + '/orig/' + id + '.' + ext;



    if (type == 'jpeg') {
        type = 'jpg';
    }

    if (CFG.app.uploads.types.indexOf(type) == -1) {
        return cb(new Error('Image type not supported'));
    }

    streamToBuffer(stream, function(buf) {
        if (!buf.length) {
            return cb();
        }

        Lwip.open(buf, type, function(err, image) {
            if (err) {
                return cb(err);
            }

            image.writeFile(orig, function(err) {
                if (err) {
                    return cb(err);
                }

                var curW = image.width(),
                    curH = image.height(),
                    q    = 1;

                if (curW > w) {
                    q = w / curW;
                    curW *= q;
                    curH *= q;
                }

                if (curH > h) {
                    q = h / curH;
                    curW *= q;
                    curH *= q;
                }

                image.resize(curW, curH, function(err, image) {
                    if (err) {
                        return cb(err);
                    }
                    image.writeFile(dst, cb);
                });
            });
        });
    });
}
