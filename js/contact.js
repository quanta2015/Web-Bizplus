
var CONTACT = {
  onReady: function () {
    initGlobel(function(langDB) {
      _langDB = langDB;
      renderMenu();
      renderFoorter();
      initLanguageMenu();
      CONTACT.render();
      // CONTACT.initForm();

      $("body").on("click","#btn-contact",CONTACT.handleSubmit)
    })
  },

  handleSubmit: function () {
    var forms = document.getElementsByClassName('m-form-contact');
    // var forms = $('.m-form-contact');
    var validation = Array.prototype.filter.call(forms, function (form) {
      if (form.checkValidity() === false) {
        form.classList.add('was-validated');
      } else {
        var obj = {
          "name":$("#fs_name").val(),
          "email":$("#fs_mail").val(),
          "tel":$("#fs_tel").val(),
          "title":$("#fs_title").val(),
          "contact":$("#fs_contact").val(), 
          "type":$("#fs_type").val()
        };
        console.log(obj);
        promise('POST', POST_COMMENT, JSON.stringify(obj), MASK, function (e) {  
          console.log(e);
          toastr.success(MSG_COMMENT_SUCCESS)
          // alert(MSG_COMMENT_SUCCESS);
        });
      }
    })
  },


  render: function () {
    renderTmpl('/tmpl/contact/contact.tmpl', function (r) {
      data = _langDB[_langDB.cur].contact
      $('.m-contact').append($.templates(r).render(data, rdHelper));
      // CONTACT.initMap();
    })
  }
}

$(CONTACT.onReady);