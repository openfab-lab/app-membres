const _ = require('lodash');
const qs = require('qs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ManagedError = require('saga-managed-error');
const favicon = require('serve-favicon');
const sassMiddleware = require('node-sass-middleware');

const autoroute = require('./libs/autoroute');
const applyAuthentication = require('./authentication');

const mdDisplay = require('./controllers/md')

const log = require('saga-logger').create({
  module: module.id
});

module.exports = () => {
  log.debug('ROUTER_LOADING');
  const app = express();

  const router = autoroute(
    express.Router,
    path.join(__dirname, './controllers'), {
      read: 'get',
      create: 'post',
      update: 'patch',
      destroy: 'delete'
    }, [
      'user'
    ]
  );

  // Allow querystring parsing of object dot representation
  app.set('query parser', query => qs.parse(query, {
    arrayLimit: 9999,
    allowDots: true
  }));

  // Sass compilation
  app.use(sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'static/css'),
    debug: false,
    outputStyle: 'compressed',
    prefix: '/css'
  }));

  app.use(bodyParser.urlencoded({
    extended: false,
    type: 'application/x-www-form-urlencoded'
  }));

  app.use(
    bodyParser.json({
      strict: true,
      limit: '200mb'
    })
  );

  app.use(favicon('./src/static/images/favicon.ico'));
  app.use(express.static('./src/static/'));

  applyAuthentication(app);

  app.use('/', router);
  app.get('/md/*', mdDisplay);

  app.all('*', (req, res, next) => {
    next(new ManagedError('API_GENERAL', 404));
  });

  // Error Handler (the 4 arguments are required!)
  app.use((error, req, res, next) => { // NOSONAR
    const statusCode = error.statusCode || 500;
    const data = {
      error: error.message
    };

    if (error.validations) {
      data.validations = error.validations;
    }

    const meta = _.pick(req, ['method', 'path', 'query', 'body']);

    log.error('API_FAIL', error, meta);
    res.status(statusCode).json(data);
  });

  return app;
};
