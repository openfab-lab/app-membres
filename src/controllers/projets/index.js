const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

const models = require('../../models');
const views = require('../../views');

module.exports.read = async (params, meta) => {
  //  Privacy level according to user identity
  const privacyLevel = meta.user ? [models.projects.privacyLevels.MEMBERS, models.projects.privacyLevels.PUBLIC] : models.projects.privacyLevels.PUBLIC;

  // Asking for one particular project
  if (params.id) {
    const project = await models.projects.find({
      where: {
        slug: params.id,
        privacyLevel: privacyLevel
      },
      raw: true
    });

    if (!project) {
      return 404;
    }

    // Convert Quill Delta object to HTML
    var converter = new QuillDeltaToHtmlConverter(project.longDescription, {});
    var projectLongDescriptionHtml = converter.convert();

    return views.render('./src/views/projects/project.ejs', {
      user: meta.user,
      project: project,
      projectLongDescriptionHtml
    });
  }

  const projects = await models.projects.findAll({
    where: {
      privacyLevel: privacyLevel
    },
    include: [{
      model: models.users,
      as: 'users'
    }]
  });

  return views.render('./src/views/projects/index.ejs', {
    user: meta.user,
    projects: projects
  });
};
