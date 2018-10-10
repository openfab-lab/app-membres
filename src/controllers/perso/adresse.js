const views = require('../../views');
const models = require('../../models');

const vatlayer = require('../../resources/vatlayer');

const view = './src/views/perso/adresse.ejs';

module.exports.read = async (params, meta) => {
  const billingDetails = await models.billingdetails.find({
    where: {
      userId: meta.user.id
    },
    attributes: { exclude: ['password'] },
    raw: true
  });

  console.log(billingDetails);

  return views.render(view, {
    user: meta.user,
    billingDetails: billingDetails,
    errorMessage: null,
    successMessage: null
  });
};

module.exports.create = async (params, meta, req, res) => {
  const billingDetails = await models.billingdetails.find({
    where: {
      shortId: params.id
    },
    raw: true
  });

  if (!billingDetails.userId === meta.user.id) {
    return views.render(view, {
      user: meta.user,
      billingDetails: billingDetails,
      errorMessage: 'Tu ne peux pas éditer une autre adresse que la tienne !',
      successMessage: null
    });
  }

  let validVAT = true;

  if (params.vat.length > 0) {
    validVAT = await vatlayer.validateVAT(params.vat);
  }

  if (validVAT) {
    return models.billingdetails.update(
      {
        company: params.company,
        vat: params.vat,
        address1: params.address_line1,
        address2: params.address_line2,
        postcode: params.postal_code,
        city: params.city,
        country: params.country
      }, {
        where: {
          shortId: params.id
        },
        returning: true,
        raw: true
      }
    ).then(result => {
      return views.render(view, {
        id: params.id,
        user: meta.user,
        billingDetails: result[1][0],
        errorMessage: null,
        successMessage: 'correctement sauvé !'
      });
    }).catch(error => {
      return views.render(view, {
        id: params.id,
        user: meta.user,
        billingDetails: null,
        errorMessage: error.message,
        successMessage: null
      });
    });
  } else {
    billingDetails.vat = params.vat;
    return views.render(view, {
      user: meta.user,
      billingDetails: billingDetails,
      errorMessage: 'Le numéro de TVA n\'est pas valide !',
      successMessage: null
    });
  }
};
