
var CAREERS = {
  onReady: function () {
    initGlobel(function(langDB) {
      _langDB = langDB;
      renderMenu();
      renderFoorter();
      initLanguageMenu();
      CAREERS.render();
    })
  },

  render: function () {
    
    renderTmpl('/tmpl/careers/careers.tmpl', function (r) {
      $('.m-careers').append($.templates(r).render(e, rdHelper));
      // CONTACT.initMap();
    })
   
  }
}

$(CAREERS.onReady);