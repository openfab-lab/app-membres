const views = require('../../views');
const models = require('../../models');

const view = './src/views/inscription/etape1b.ejs';

module.exports.read = async (params, meta) => {
  return views.render(view, {
    id: params.id,
    user: meta.user,
    returningSubscription: {},
    errorMessage: null
  });
};

module.exports.create = async (params, meta, req, res) => {
  return models.users.find({
    where: {
      shortId: params.id
    },
    attributes: { exclude: ['password'] },
    raw: true
  }).then(user => {
    return models.billingdetails.create({
      company: req.body.company_name,
      inTheNameOf: `${user.firstName} ${user.lastName}`,
      vat: req.body.vat_number,
      address1: req.body.address_line1,
      address2: req.body.address_line2,
      postcode: req.body.postal_code,
      city: req.body.city,
      country: req.body.country,
      userId: user.id
    })
      .then(result => {
        return {
          redirect: '/inscription/etape2?id=' + params.id
        };
      }).catch(error => {
        return views.render(view, {
          id: params.id,
          user: meta.user,
          returningSubscription: req.body,
          errorMessage: error
        });
      });
  });
};
