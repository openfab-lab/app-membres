var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

const models = require('../../../models');

const views = require('../../../views');

module.exports.read = async (params, meta) => {
  const user = await models.users.findById(meta.user.id);
  const projects = await user.getProjects({
    include: [{
      all: true
    }]
  });

  if (params.id) {
    console.log(params.id);
    // @TODO: escape param
    const filteredProjects = projects.filter((p) => p.slug === params.id);

    if (!filteredProjects.length) {
      // 404
      return 404;
    }

    const project = filteredProjects[0];
    // Convert Quill Delta object to HTML
    const converter = new QuillDeltaToHtmlConverter(project.longDescription, {});
    const projectLongDescriptionHtml = converter.convert();

    console.debug(project);
    return views.render('./src/views/perso/projects/project.ejs', {
      user: meta.user,
      project: project,
      projectLongDescriptionHtml
    });
  }

  return views.render('./src/views/perso/projects/index.ejs', {
    user: meta.user,
    projects: projects
  });
};
