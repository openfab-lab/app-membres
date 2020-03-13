const _ = require('lodash');
const config = require('config');
const passport = require('passport');
const session = require('cookie-session');
const hashPassword = require('../helpers/hashPassword');
const hashEmail = require('../helpers/hashEmail');

const models = require('../models');

const publicRoutes = {
  '/connexion': ['GET'],
  '/contact': ['GET', 'POST'],
  '/membres': ['GET'],
  '/healthcheck': ['GET'],
  '/md': ['GET'],
  '/inscription': ['GET', 'POST']
};

const adminRoutes = {
  '/admin': ['GET', 'POST', 'PUT', 'DELETE']
};

const pathIsInList = (path, method, pathList) => {
  return _.some(_.keys(pathList), allowedPath => {
    return _.startsWith(path, allowedPath) &&
      pathList[allowedPath].includes(method);
  });
};

const checkAuthentication = (req, res, next) => {
  // Is user authorized to access admin routes
  if (req.user &&
      pathIsInList(req.path, req.method, adminRoutes) &&
      req.user.permissionsLevel !== 3) {
    return res.sendStatus(401);
  }
  if (req.user &&
    pathIsInList(req.path, req.method, adminRoutes) &&
    req.user.permissionsLevel === 3) {
    return next();
  }

  // Is in list of public routes
  if (pathIsInList(req.path, req.method, publicRoutes)) {
    return next();
  }

  // if it is homepage
  if (req.path === '/') {
    return next();
  }

  // Is an user logged
  if (req.user) {
    return next();
  }

  // If non of above, you're not authorized, go away!
  return res.sendStatus(401);
};

const checkLogin = (loginData) => {
  return models.users.findOne({
    where: { email: loginData.email.toLowerCase().trim() }
  })
    .then(user => {
      if (!user || user.password === 'PASSWORD_RESETTED') {
        throw new Error('INVALID_LOGIN');
      }

      return hashPassword.compare(loginData.password, user.password)
        .then(match => {
          if (!match) {
            throw new Error('INVALID_LOGIN');
          }

          return user;
        });
    });
};

module.exports = (app) => {
  app.use(session({
    secret: config.security.secret,
    maxAge: config.security.sessionLifeTime
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    user.hashedEmail = hashEmail.hashMd5(user.email);
    done(null, user);
  });

  app.post('/connexion', (req, res) => {
    checkLogin(req.body)
      .then(user => {
        req.login(user, err => {
          if (err) {
            throw err;
          }

          res.redirect('/');
        });
      })
      .catch(err => {
        return res.status(403).json({
          success: false,
          error: err.message
        });
      });
  });

  // all routes declared after this point will require authentication
  app.all('*', checkAuthentication);

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  return app;
};
