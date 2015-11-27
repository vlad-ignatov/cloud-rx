'use strict';

require('colors');

exports.up = function(knex) {
    process.stdout.write('\t• Creating table "meds"... '.yellow);
    return knex.schema.createTable('meds', function (table) {
        table.increments();// id
        table.string('name', 255).notNullable();
        table.string('rxnorm', 20);//.notNullable().unique();
        table.string('NDC', 50).defaultTo(null);
        table.string('dose').defaultTo(null);
        table.string('instructions', 255).defaultTo(null);
        table.string('manufacturer', 255).defaultTo(null);
        table.text('description').defaultTo(null).comment('medical uses');
        table.timestamps();
    }).then(
        function() {
            console.log('DONE'.green);
        },
        function(err) {
            console.log('FAILED'.red);
            console.error(err);
        }
    );
};

exports.down = function(knex) {
    process.stdout.write('\t• Droping table "meds"... '.yellow);
    return knex.schema.dropTable('meds').then(
        function() {
            console.log('DONE'.green);
        },
        function(err) {
            console.log('FAILED'.red);
            console.error(err);
        }
    );
};
