// migration.config.js
const config = require('config');
console.log('========>', config.get('database.password'));
module.exports = {
    databaseUrl: `postgres://postgres:admin@localhost:5432/task_management`,
    // databaseUrl: `postgres://${config.get('database.user')}:${config.get('database.password')}@${config.get('database.host')}:${config.get('database.port')}/${config.get('database.database')}`,
    migrationsTable: 'pgmigrations',
    dir: 'migrations',
    direction: 'up',
    count: Infinity,
    timestamp: true,
  };
  