const views = require('../../views');
const models = require('../../models');

const vatlayer = require('../../resources/vatlayer');

const view = './src/views/inscription/etape1b.ejs';

module.exports.read = async (params, meta) => {
  return views.render(view, {
    id: params.id,
    user: meta.user,
    returningBillingAddress: {},
    errorMessage: null
  });
};

module.exports.create = async (params, meta, req, res) => {
  let validVAT = true;

  if (params.vat_number.length > 0) {
    validVAT = await vatlayer.validateVAT(params.vat_number);
  }

  if (validVAT) {
    const user = await models.users.find({
      where: {
        shortId: params.id
      },
      attributes: { exclude: ['password'] },
      raw: true
    });

    return models.billingdetails.create({
      company: params.company_name,
      inTheNameOf: `${user.firstName} ${user.lastName}`,
      vat: params.vat_number,
      address1: params.address_line1,
      address2: params.address_line2,
      postcode: params.postal_code,
      city: params.city,
      country: params.country,
      userId: user.id
    }).then(result => {
      return {
        redirect: '/inscription/etape2?id=' + params.id
      };
    }).catch(error => {
      return views.render(view, {
        id: params.id,
        user: meta.user,
        returningBillingAddress: params,
        errorMessage: error
      });
    });
  } else {
    return views.render(view, {
      id: params.id,
      user: meta.user,
      returningBillingAddress: params,
      errorMessage: 'Le numéro de TVA est invalide'
    });
  }
};
