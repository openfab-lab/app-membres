const config = require('config');
const Sequelize = require('sequelize');

let logging = false;
if (process.env.LOG_LEVEL === 'debug') {
  logging = console.log;
}

module.exports = new Sequelize(
  config.pg.db,
  config.pg.user,
  config.pg.password,
  {
    dialect: 'postgres',
    host: config.pg.host,
    logging
  }
);
