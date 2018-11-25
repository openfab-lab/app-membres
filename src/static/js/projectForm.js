'use strict';

$().ready(function () {
  // Deletion
  document.querySelector('#js-delete-project').onclick = function () {
    // Send ajax request
    $.ajax({
        method: 'DELETE',
        url: '.',
        data: {
          id: '<%= returningNewProject.id %>'
        }
      })
      .done(function (msg) {
        console.log(msg);
        window.location = '/perso/projets';
      })
      .fail((e) => {
        console.error(e);
        alert('Échec de la suppression');
      });
  }

  // On submission, put quill editor data in corresponding field
  document.querySelector('#js-project-form').onSubmit = function () {
    document.querySelector('input[name=long_description]').value = JSON.stringify(projectContentEditor.getContents());
    return true;
  }

  // Initialize Quill editor
  window.projectContentEditor = new Quill('#editor', {
    theme: 'snow'
  });
});
