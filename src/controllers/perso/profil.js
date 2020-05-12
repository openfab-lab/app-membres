const views = require('../../views');
const models = require('../../models');
const hashEmail = require('../../helpers/hashEmail');

const view = './src/views/perso/profil.ejs';

module.exports.read = async (params, meta) => {
  return models.users.find({
    where: {
      passportId: meta.user.passportId
    },
    attributes: { exclude: ['password'] },
    raw: true
  }).then(user => {
    user.hashedEmail = hashEmail.hashMd5(user.email);

    return views.render(view, {
      user: user,
      errorMessage: null,
      successMessage: null
    });
  });
};

module.exports.create = async (params, meta, req, res) => {
  if (params.id !== meta.user.passportId) {
    return views.render(view, {
      user: meta.user,
      returningSubscription: req.body,
      errorMessage: 'Tu ne peux pas éditer un autre profil que le tiens !',
      successMessage: null
    });
  }

  console.log(params);

  return models.users.update(
    {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phoneNumber: params.phoneNumber,
      github: params.github,
      bio: params.bio,
      imageRightsConsent: params.hasOwnProperty('imageRightsConsent') && params.imageRightsConsent === 'on'
    }, {
      where: {
        passportId: params.id
      },
      returning: true,
      raw: true
    }
  ).then(result => {
    result[1][0].hashedEmail = hashEmail.hashMd5(result[1][0].email);
    return views.render(view, {
      id: params.id,
      user: result[1][0],
      errorMessage: null,
      successMessage: 'correctement sauvé !'
    });
  }).catch(error => {
    return views.render(view, {
      id: params.id,
      user: meta.user,
      errorMessage: error.message,
      successMessage: null
    });
  });
};
