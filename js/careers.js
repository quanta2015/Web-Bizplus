
var CAREERS = {
  onReady: function () {
    initGlobel(function(langDB) {
      _langDB = langDB;
      renderMenu();
      renderFoorter();
      initLanguageMenu();
      CAREERS.render();

      $("body").on("click","#btn-career",CAREERS.doContact)
    })
  },

  doContact: function() {
    window.location = "contact.html"
  },

  render: function () {
    
    renderTmpl('/tmpl/careers/careers.tmpl', function (r) {
      data = _langDB[_langDB.cur].careers
      $('.m-careers').append($.templates(r).render(data, rdHelper));
    })
   
  }
}

$(CAREERS.onReady);