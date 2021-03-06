const views = require('../../views');
const models = require('../../models');
const hashPassword = require('../../helpers/hashPassword');

const view = './src/views/inscription/etape1.ejs';

module.exports.read = async (params, meta) => {
  return views.render(view, {
    user: meta.user,
    returningSubscription: {},
    errorMessage: null
  });
};

module.exports.create = async (params, meta, req, res) => {
  if (req.body.password_a !== req.body.password_b) {
    return views.render(view, {
      user: meta.user,
      returningSubscription: req.body,
      errorMessage: 'Les deux mots de passe ne correspondent pas'
    });
  }

  return models.users.create({
    email: req.body.email_address,
    username: req.body.username,
    password: await hashPassword.encrypt(req.body.password_a),
    firstName: req.body.first_name,
    phoneNumber: req.body.phone_number,
    lastName: req.body.last_name,
    language: 'fr',
    permissionsLevel: 0
  })
    .then(result => {
      return {
        redirect: '/inscription/etape1b?id=' + result.shortId
      };
    }).catch(error => {
      return views.render(view, {
        user: meta.user,
        returningSubscription: req.body,
        errorMessage: error.original.detail
      });
    });
};
