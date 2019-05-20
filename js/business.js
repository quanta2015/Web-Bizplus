
var BUSINESS = {
  onReady: function () {
    renderMenu();
    renderFoorter();
    BUSINESS.render();
    
  },

  render: function () {
    const typeIdx = parseInt(getUrlVars()["type"]);

    if (typeIdx == 0) {
      renderTmpl('/tmpl/business/business.tmpl', function (r) {
        $('.m-business').append($.templates(r).render(e, rdHelper));
      })
    }else if (typeIdx == 1) {
      renderTmpl('/tmpl/business/foreigner.tmpl', function (r) {
        $('.m-business').append($.templates(r).render(e, rdHelper));
      })
    }else if (typeIdx == 2) {
      renderTmpl('/tmpl/business/develop.tmpl', function (r) {
        $('.m-business').append($.templates(r).render(e, rdHelper));
      })
    }else if (typeIdx == 3) {
      renderTmpl('/tmpl/business/other.tmpl', function (r) {
        $('.m-business').append($.templates(r).render(e, rdHelper));
      })
    }else if (typeIdx == 4) {
      renderTmpl('/tmpl/business/achieve.tmpl', function (r) {
        $('.m-business').append($.templates(r).render(e, rdHelper));
      })
    }
   
  }
}

$(BUSINESS.onReady);