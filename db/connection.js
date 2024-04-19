
// console.log(process.env);

const pg = require('pg-promise');
const config = require('config');

const configuration = {
    host: config.get('database.host'),
    port: config.get('database.port'),
    database: config.get('database.database'),
    user: config.get('database.user'),
    password: config.get('database.password')
}

const db = pg()(configuration);

module.exports = {
    db,
}