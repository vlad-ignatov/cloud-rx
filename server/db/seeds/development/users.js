'use strict';

require('colors');
var bcrypt = require('bcrypt');

var now = new Date().toISOString().split('.')[0].replace('T', ' ');

const SALT = bcrypt.genSaltSync(10);

exports.seed = function(knex, Promise) {
    process.stdout.write('\t• Seeding table "users"... '.magenta);
    return Promise.join(
        // Deletes ALL existing entries
        knex('users').del(),

        // Inserts seed entries
        knex('users').insert([
            {
                name    : 'Vladimir Ignatov',
                email   : 'vlad.ignatov@gmail.com',
                username: 'vlad',
                password: bcrypt.hashSync('pass', SALT),
                role    : 'admin'
            },
            {
                name    : 'Vladimir Ignatov',
                email   : 'vlad_ignatov@abv.bg',
                username: 'vlad-manager',
                password: bcrypt.hashSync('vlad-manager-pass', SALT),
                role    : 'manager'
            },
            {
                name    : 'Vladimir Ignatov',
                email   : 'vladimir.ignatov@medapptech.com',
                username: 'vlad-user',
                password: bcrypt.hashSync('vlad-user-pass', SALT),
                role    : 'user'
            }
        ].map(rec => {
            rec.created_at = now;
            rec.updated_at = now;
            return rec;
        }))

    ).then(
        function() {
            console.log('DONE'.green);
        },
        function(err) {
            console.log('FAILED'.red);
            console.error(err);
        }
    );
};
