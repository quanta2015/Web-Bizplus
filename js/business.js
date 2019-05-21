
var BUSINESS = {
  onReady: function () {
    initGlobel(function(langDB) {
      _langDB = langDB;
      renderMenu();
      renderFoorter();
      initLanguageMenu();
      BUSINESS.render();
    })
  },

  render: function () {
    const typeIdx = parseInt(getUrlVars()["type"]);

    if (typeIdx == 0) {
      renderTmpl('/tmpl/business/business.tmpl', function (r) {
        data = _langDB[_langDB.cur].business
        $('.m-business').append($.templates(r).render(data, rdHelper));
      })
    }else if (typeIdx == 1) {
      renderTmpl('/tmpl/business/foreigner.tmpl', function (r) {
        data = _langDB[_langDB.cur].foreigner
        $('.m-business').append($.templates(r).render(data, rdHelper));
      })
    }else if (typeIdx == 2) {
      renderTmpl('/tmpl/business/develop.tmpl', function (r) {
        data = _langDB[_langDB.cur].outsource
        $('.m-business').append($.templates(r).render(data, rdHelper));
      })
    }else if (typeIdx == 3) {
      renderTmpl('/tmpl/business/other.tmpl', function (r) {
        data = _langDB[_langDB.cur].other
        $('.m-business').append($.templates(r).render(data, rdHelper));
      })
    }else if (typeIdx == 4) {
      renderTmpl('/tmpl/business/achieve.tmpl', function (r) {
        data = _langDB[_langDB.cur].achieve
        $('.m-business').append($.templates(r).render(data, rdHelper));
      })
    }
   
  }
}

$(BUSINESS.onReady);