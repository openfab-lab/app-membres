require('./models');
const server = require('./server');
const sequelize = require('./resources/postgresql');
const log = require('saga-logger').create({ module: module.id });
const config = require('config');

// Catch all uncaught exception, log it and then die properly
process.on('uncaughtException', err => {
  log.fatal('UNCAUGHT_EXCEPTION', err);
  process.exit(1);
});

const start = async () => {
  await sequelize.sync();
  server().listen(config.app.port, err => {
    if (err) {
      return log.error('SERVER_STARTED_FAIL', err);
    }

    log.info('SERVER_STARTED_SUCCESS', { port: config.app.port });
  });
};

start();
