
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
      data = _langDB[_langDB.cur].careers
      $('.m-careers').append($.templates(r).render(data, rdHelper));
    })
   
  }
}

$(CAREERS.onReady);