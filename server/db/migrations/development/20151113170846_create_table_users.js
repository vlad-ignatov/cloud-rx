'use strict';

require('colors');

exports.up = function(knex) {
    process.stdout.write('\t• Creating table "users"... '.yellow);
    return knex.schema.createTable('users', function (table) {
        table.increments();// id
        table.string('name', 100).notNullable().comment('full name');
        table.string('email', 100).notNullable().unique();
        table.string('username', 20).notNullable().unique();
        table.string('password', 255).notNullable();
        table.enu('role', ['user','manager','admin']).notNullable().defaultTo('user');
        table.string('sid', 255).nullable().defaultTo(null);
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
    process.stdout.write('\t• Droping table "users"... '.yellow);
    return knex.schema.dropTable('users').then(
        function() {
            console.log('DONE'.green);
        },
        function(err) {
            console.log('FAILED'.red);
            console.error(err);
        }
    );
};
