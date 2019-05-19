
var ABOUT = {
  onReady: function () {
    renderMenu();
    renderFoorter();
    ABOUT.render();
  },

  render: function () {
    const typeIdx = parseInt(getUrlVars()["type"]);

    if (typeIdx == 3) {
      renderTmpl('/tmpl/about/security.tmpl', function (r) {
        $('.m-about').append($.templates(r).render(e, rdHelper));
      })
    }else if (typeIdx == 2) {
      renderTmpl('/tmpl/about/group.tmpl', function (r) {
        $('.m-about').append($.templates(r).render(e, rdHelper));
      })
    }else if (typeIdx == 0) {
      renderTmpl('/tmpl/about/about.tmpl', function (r) {
        $('.m-about').append($.templates(r).render(e, rdHelper));
      })
    }
  }
}

$(ABOUT.onReady);


