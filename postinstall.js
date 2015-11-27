'use strict';

require('colors');
var dbCfg = require('./server/db/knexfile.js');
var knex  = require('knex');
var hasError = false;
var tasks = [];

// for each environment - try to initialize
for ( let env in dbCfg ) {
    tasks.push(() => {
        let knexInst = knex(dbCfg[env]);
        return knexInst.migrate.latest().then(() => (
            knexInst.seed.run().then(() => (
                knexInst.destroy().then(() => (
                    console.log("Initialized database for %s", env)
                ))
            ))
        )).finally(() => {
            knexInst.destroy();
        })
    }());
}

Promise.all(tasks).then(
    () => console.log('🍺  All done!'.bold),
    (error) => {

        console.error(error.stack.red);
        // Loop over the defined environments and collect all the databases and their
        // users and passowrds
        var dbs = {};
        for ( let env in dbCfg ) {
            let cfg = dbCfg[env];
            if (!dbs[cfg.connection.database]) {
                dbs[cfg.connection.database] = {};
            }
            dbs[cfg.connection.database][cfg.connection.user] = cfg.connection.password;
        }

        console.log(
            'IMPORTANT!\n'.bold +
            ('Please make sure that You have created the follwing MySQL databases ' +
            'and privileged\nusers for them:').green
        );

        console.log('\n');
        for ( let db in dbs ) {
            console.log('\tdatabase: ' + '%s'.bold, db);
            for (let user in dbs[db]) {
                console.log('\t    user: ' + String(user).bold + ' -> pass: ' + dbs[db][user].bold);
            }
            console.log('\n');
        }

        console.log(
            ('If you want to use differend DB/user names please also set them\n' +
            'in this file: %s').green,
            (__dirname + '/server/db/knexfile.js').bold
        );
        console.log(
            'When you are done come back and run %s to populate these databses'.green,
            'npm postinstall'.bold
        );
    }
);

/*
CREATE USER 'cloudrx_dev_user'@'localhost' IDENTIFIED BY '***';GRANT USAGE ON *.*
TO 'cloudrx_dev_user'@'localhost' IDENTIFIED BY '***' WITH MAX_QUERIES_PER_HOUR 0
MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT ALL PRIVILEGES ON `cloudrx\_dev`.* TO 'cloudrx_dev_user'@'localhost'WITH GRANT OPTION;
*/
