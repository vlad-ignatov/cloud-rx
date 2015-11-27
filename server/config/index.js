var Path     = require('path');
var rootPath = Path.normalize(__dirname + '/../..');

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2 MB

var supportedEnvironments = [
    "development",
    "production",
    "staging",
    "testing"
];

var ENV = (process.env.NODE_ENV || "").toLowerCase();
if (!ENV || supportedEnvironments.indexOf(ENV) == -1) {
    ENV = "production";
}

var dbSettings = {
    production : {
        debug : false,
        client: 'mysql',
        connection: {
            host     : 'localhost',
            port     : 3306,
            user     : 'cloudrx_user',
            password : 'cloudrx_pass',
            database : 'cloudrx'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations',
            directory: Path.join(rootPath,  '/server/db/migrations/production')
        },
        seeds: {
            directory: Path.join(rootPath,  '/server/db/seeds/production')
        }
    },
    development: {
        debug : true,
        client: 'mysql',
        connection: {
            host     : 'localhost',
            port     : 3306,
            user     : 'cloudrx_dev_user',
            password : 'cloudrx_dev_pass',
            database : 'cloudrx_dev'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations',
            directory: Path.join(rootPath, '/server/db/migrations/development')
        },
        seeds: {
            directory: Path.join(rootPath, '/server/db/seeds/development')
        }
    },
    // testing: {
    //     debug : false,
    //     client: 'mysql',
    //     connection: {
    //         host     : 'localhost',
    //         port     : 3306,
    //         user     : 'cloudrx_test_user',
    //         password : 'cloudrx_test_pass',
    //         database : 'cloudrx_test'
    //     },
    //     pool: {
    //         min: 2,
    //         max: 10
    //     },
    //     migrations: {
    //         tableName: 'migrations',
    //         directory: Path.join(rootPath, '/server/db/migrations/testing')
    //     },
    //     seeds: {
    //         directory: Path.join(rootPath, '/server/db/seeds/testing')
    //     }
    // },
    // staging: {
    //     debug : false,
    //     client: 'mysql',
    //     connection: {
    //         host     : 'localhost',
    //         port     : 3306,
    //         user     : 'cloudrx_stage_user',
    //         password : 'cloudrx_stage_pass',
    //         database : 'cloudrx_stage'
    //     },
    //     pool: {
    //         min: 2,
    //         max: 10
    //     },
    //     migrations: {
    //         tableName: 'migrations',
    //         directory:Path.join(rootPath, '/server/db/migrations/staging')
    //     },
    //     seeds: {
    //         directory: Path.join(rootPath, '/server/db/seeds/staging')
    //     }
    // }
};

module.exports = {
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(rootPath, 'client/www')
            },
            payload : {
                output   : "data",
                maxBytes : MAX_UPLOAD_SIZE,
                parse    : true
            }
        },
        router : {
            stripTrailingSlash: true
        }
    },
    app: {
        root: rootPath,
        host: 'localhost',
        port: 3000,
        knex: dbSettings[ENV] || dbSettings.production,
        dbSettings: dbSettings,
        maxUploadSize: MAX_UPLOAD_SIZE,
        uploads: {
            types: [ 'png', 'gif', 'jpg' ],
            meds: {
                maxSize : MAX_UPLOAD_SIZE, // 2 MB
                dest : Path.join(rootPath, 'client/www/img/meds'),
                defaultImage : Path.join(rootPath, 'client/www/img/meds.jpg'),
                extension: 'png',
                thumbnail: {
                    width : 300,
                    height: 400
                }
            }
        }
    }
};
