
var ABOUT = {
  onReady: function () {
    initGlobel(function(langDB) {
      _langDB = langDB;
      renderMenu();
      renderFoorter();
      initLanguageMenu();
      ABOUT.render();
    })
  },

  render: function () {
    const typeIdx = parseInt(getUrlVars()["type"]);

    if (typeIdx == 3) {
      renderTmpl('/tmpl/about/security.tmpl', function (r) {
        data = _langDB[_langDB.cur].security
        $('.m-about').append($.templates(r).render(data, rdHelper));
      })
    }else if (typeIdx == 2) {
      renderTmpl('/tmpl/about/group.tmpl', function (r) {
        $('.m-about').append($.templates(r).render(e, rdHelper));
      })
    }else if (typeIdx == 0) {
      renderTmpl('/tmpl/about/about.tmpl', function (r) {
        data = _langDB[_langDB.cur].about
        $('.m-about').append($.templates(r).render(data, rdHelper));
      })
    }
  }
}

$(ABOUT.onReady);


