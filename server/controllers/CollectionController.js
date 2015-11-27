'use strict'

var Boom = require('boom')
var lib  = require('../lib')

const operatorMap = {
    "eq"           : { op: "="  },
    "ne"           : { op: "<>" },
    "gt"           : { op: ">"  },
    "ge"           : { op: ">=" },
    "lt"           : { op: "<"  },
    "le"           : { op: "<=" },
    "begins"       : { op: "LIKE"    , pattern : "?%"  },
    "ends"         : { op: "LIKE"    , pattern : "%?"  },
    "contains"     : { op: "LIKE"    , pattern : "%?%" },
    "not-ends"     : { op: "NOT LIKE", pattern : "?%"  },
    "not-begins"   : { op: "NOT LIKE", pattern : "%?"  },
    "not-contains" : { op: "NOT LIKE", pattern : "%?%" },
    "in"           : { op: "IN"          },
    "not-in"       : { op: "NOT IN"      },
    "between"      : { op: "BETWEEN"     },
    "not-between"  : { op: "NOT BETWEEN" },
    "null"         : { op: "IS NULL"     },
    "not-null"     : { op: "IS NOT NULL" }
};

class CollectionController
{
    constructor(collection) {
        this.collection = collection
    }

    /**
     * Creates and returns a filtered collection that can be fetched or used as
     * needed
     *
     * @param {Object} options
     *
     * The options may have various query parameters:
     *
     * 1. Regular parameters - the following are accepted:
     *
     *    orwhere - Pass non-falsy value to join different where clauses with
     *              "OR". By default they are joined with "AND".
     *    limit   - Unsigned integer >= 0 and <= 500. limit <= 0 means no limit,
     *              which will be converted internally to the max limit of 500.
     *    offset  - Unsigned integer >= 0. Defaults to 0.
     *    sort    - One or more "sort:asc=name" or "sort:desc=name" parameters
     *    columns - One or more columns to include in the results. If used, the
     *              result will be an array of plain objects (instead of array
     *              of models) and the nest option will be ignored.
     *
     * 1. Search parameters
     *
     *    These must be prefixed with "q:" like "q:name=value". The syntax is
     *    q:{db column name}[:operator]=value where the operator can be found
     *    in the examples below:
     *
     *    q:name:eq=value (or just q:name=value)
     *    q:name:ne=value           - Is different than
     *    q:name:gt=value           - Is greater than
     *    q:name:ge=value           - Is greater than or equal to
     *    q:name:lt=value           - Is less than
     *    q:name:le=value           - Is less than or equal to
     *    q:name:begins=value       - Begins with
     *    q:name:ends=value         - Ends with
     *    q:name:contains=value     - Contains
     *    q:name:not-ends=value     - Does not end with
     *    q:name:not-begins=value   - Does not begin with
     *    q:name:not-contains=value - Does not contain
     *    q:name:in=value           - In the array
     *    q:name:not-in=value       - Not in the array
     *    q:name:between=min,max    - Between min and max
     *
     * @param {Function} cb errback
     */
    query(options = {}) {
        var collection = new this.collection(),
            q = collection.query(),
            or = lib.bool(options.orwhere),
            value, t, k, l, op = "=", sortDir;

        // WHERE
        for (k in options) {
            if (options.hasOwnProperty(k)) {
                value = options[k];
                t = k.split(":");
                l = k.length;

                if (l < 2) {
                    continue;
                }

                // if he key begins with "q:"
                if (t[0] == "q") {

                    // find the operator
                    op = operatorMap[t[2] || "eq"];
                    if (!op) {
                        throw Boom.badRequest('Invalid query')
                    }
                    op = op.op;

                    // LIKE
                    if (op == "LIKE" || op == "NOT LIKE") {
                        q[or ? "orWhere" : "where"](
                            t[1], // name
                            op, // operator
                            operatorMap[t[2]].pattern.replace( // value
                                /\?/,
                                String(value).replace(/([%_\\])/g, "\\$1")
                            )
                        );
                    }

                    // IN
                    else if (op == "IN") {
                        q[or ? "orWhereIn" : "whereIn"](
                            t[1],
                            Array.isArray(value) ? value : String(value).split(/\s*,\s*/)
                        );
                    }

                    // NOT IN
                    else if (op == "NOT IN") {
                        q[or ? "orWhereNotIn" : "whereNotIn"](
                            t[1],
                            Array.isArray(value) ? value : String(value).split(/\s*,\s*/)
                        );
                    }

                    // BETWEEN
                    else if (op == "BETWEEN") {
                        value = value.trim().split(/\s*,\s*/);
                        if (value.length == 2) {
                            q[or ? "orWhereBetween" : "whereBetween"](
                                t[1],
                                [lib.floatVal(value[0]), lib.floatVal(value[1])]
                            );
                        }
                    }

                    // NOT BETWEEN
                    else if (op == "NOT BETWEEN") {
                        value = value.trim().split(/\s*,\s*/);
                        if (value.length == 2) {
                            q[or ? "orWhereNotBetween" : "whereNotBetween"](
                                t[1],
                                [lib.floatVal(value[0]), lib.floatVal(value[1])]
                            );
                        }
                    }

                    // NULL
                    else if (op == "IS NULL") {
                        q[or ? "orWhereNull" : "whereNull"](
                            t[1],
                            value
                        );
                    }

                    // NOT NULL
                    else if (op == "IS NOT NULL") {
                        q[or ? "orWhereNotNull" : "whereNotNull"](
                            t[1],
                            value
                        );
                    }

                    // NORMAL (=,>,<,<>,<=,>=)
                    else {
                        q[or ? "orWhere" : "where"](t[1], op, value);
                    }
                }

                // Sort
                else if (t[0] == "sort") {
                    sortDir = String(t[1] || "desc").toLowerCase();
                    q.orderBy(value, sortDir == "desc" ? "desc" : "asc");
                }
            }
        }

        if (!options.count) {

            // limit
            q.limit(Math.min(lib.uInt(options.limit, 500) || 500, 500));

            // offset
            if (options.offset) {
                q.offset(lib.uInt(options.offset));
            }

        } else {
            q.count(options.count);
        }

        // columns
        if (options.columns) {
            q.column(
                Array.isArray(options.columns) ?
                    options.columns :
                    String(options.columns).split(/\s*,\s*/)
            );
        }

        return collection;
    }

    countAll(options, cb) {
        options.count = "*";
        this.query(options).query().select().then(
            function(res) {
                cb(null, res[0]["count(*)"]);
            },
            function(err) {
                cb(err);
            }
        );
    }

    /**
     * Fetches all the models
     * @param {Object} options (optional) See the query method for options
     * @param {Function} cb errback
     * @TODO: Accept additional options for pagination, sorting etc.
     */
    index(cb) {
        var options = {}, fetchCfg = {};

        if (arguments.length == 2) {
            options = cb;
            cb = arguments[1];
        }

        if (options.columns) {
            fetchCfg.columns = Array.isArray(options.columns) ?
                options.columns :
                String(options.columns).split(/\s*,\s*/);
        }

        if (options.nest) {
            fetchCfg.withRelated = options.nest;
        }

        //this.collection.query().options({ actor : this.actor });

        this.query(options).fetch(fetchCfg).then(
            function(models) {
                cb(null, models || Boom.notFound("Collection not found"));
            },
            function(err) {
                console.error(err)
                cb(err)
            }
        );
    }

    /**
     * Inserts new record
     * @param {Object} options
     * @param {Array}  options.nest (optional) One or more relations to include
     *                              in the result
     * @param {Object} options.data The attributes of the new model
     * @param {Function} cb errback
     */
    add(options, cb) {
        options = options || { data : {} };

        var pk    = this.collection.prototype.model.prototype.idAttribute,
            model = new this.collection.prototype.model();

        if (pk in options.data) {
            delete options.data[pk];
        }

        model.save(options.data)
        .tap(function(_model) {
            if (options.nest) {
                return _model.load(options.nest);
            }
        })
        .then(function(_model) {
            cb(null, _model);
        }, cb);
    }

    /**
     * Delete model by id
     * @param {Number|Object} options Can be the id of the record to delete or
     * an object like:
     *     {
     *         id   : The model id,
     *         nest : [ ...optional relations to include in response... ]
     *     }
     * @param {Function} cb errback
     */
    remove(options, cb) {
        var pk    = this.collection.prototype.model.prototype.idAttribute,
            model = new this.collection.prototype.model(),
            tmp   = { data: {} };

        options = options || {};

        if (!isNaN(options * 1)) {
            tmp.data[pk] = lib.intVal(options);
        } else {
            tmp.data[pk] = lib.intVal(options.id);
        }

        options = tmp;

        if (!options.data[pk] || options.data[pk] < 1) {
            return cb(Boom.badData("Invalid id"));
        }

        model.set(pk, options.data[pk]).fetch({
            withRelated : options.nest
        }).then(function(_model) {
            if (!_model) {
                return cb(Boom.notFound("Model not found"));
            }

            var out = _model.toJSON();

            _model.destroy().then(function() {
                cb(null, out);
            }, cb);
        }, cb);
    }

    removeMany(ids, cb) {
        var q = this.collection.query();
        q.whereIn(this.collection.prototype.model.prototype.idAttribute, ids);
        q.select().then(
            function(models) {
                q.del().then(
                    function() {
                        cb(null, models);
                    },
                    cb
                );
            },
            cb
        );
    }

    /**
     * Uptdate model by id
     * @param {Number} id The id of the record to delete
     * @param {Object} props The properties to set
     * @param {Function} cb errback
     */
    update(options, cb) {
        var pk    = this.collection.prototype.model.prototype.idAttribute,
            model = new this.collection.prototype.model();

        model.set(pk, options.id);

        if (pk in options.data) {
            delete options.data[pk];
        }

        if ("created_at" in options.data) {
            delete options.data.created_at;
        }

        if ("updated_at" in options.data) {
            delete options.data.updated_at;
        }

        model.fetch().then(
            function(_model) {
                if (!_model) {
                    return cb(new Error("Model not found"));
                }

                model.save(options.data).tap(function() {
                    if (options.nest) {
                        return _model.load(options.nest);
                    }
                })
                .then(function() {
                    cb(null, _model);
                }, cb);
            },
            cb
        );
    }

    /**
     * Get single model by id
     * @param {Number} id The id of the record to get
     * @param {Function} cb errback
     */
    get(options, cb) {
        options = options || { data : {} };
        if (typeof options != 'object') {
            var id = lib.intVal(options),
                pk = this.collection.prototype.model.prototype.idAttribute;
            if (id < 1 || id + '' !== options + '') {
                return cb(Boom.badData("Invalid id"));
            }
            options = { data : { [pk] : id } };
        }

        if (!options.data || typeof options.data != 'object') {
            return cb(Boom.badData("Invalid arguments"));
        }

        let dataIsEmpty = true
        for (let k in options.data) {
            dataIsEmpty = false
            break
        }

        if (dataIsEmpty) {
            return cb(Boom.badData("Invalid arguments"));
        }

        var model = new this.collection.prototype.model(options.data);

        model.fetch({ withRelated : options.nest }).then(
            function(result) {
                if (!result) {
                    return cb(Boom.notFound("Model not found"));
                }
                cb(null, result);
            },
            cb
        );
    }
}

module.exports = CollectionController;
