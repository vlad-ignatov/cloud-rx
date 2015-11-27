var cfg  = require("../config/").app.knex;
var knex = require('knex')(cfg);
module.exports = knex;
