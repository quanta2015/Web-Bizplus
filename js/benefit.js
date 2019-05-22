
var BENEFIT = {
  onReady: function () {
    initGlobel(function(langDB) {
      _langDB = langDB;
      renderMenu();
      renderFoorter();
      initLanguageMenu();
      BENEFIT.render();
    })
  },

  render: function () {
    const typeIdx = parseInt(getUrlVars()["type"]);

    if (typeIdx == 0) {
      renderTmpl('/tmpl/benefit/style.tmpl', function (r) {
        data = _langDB[_langDB.cur].style
        $('.m-benefit').append($.templates(r).render(data, rdHelper));
      })
    }else if (typeIdx == 1) {
      renderTmpl('/tmpl/benefit/edu.tmpl', function (r) {
        data = _langDB[_langDB.cur].edu
        $('.m-benefit').append($.templates(r).render(data, rdHelper));
      })
    }
   
  }
}

$(BENEFIT.onReady);