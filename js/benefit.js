
var BENEFIT = {
  onReady: function () {
    renderMenu();
    renderFoorter();
    BENEFIT.render();
    
  },

  render: function () {
    const typeIdx = parseInt(getUrlVars()["type"]);

    if (typeIdx == 0) {
      renderTmpl('/tmpl/benefit/style.tmpl', function (r) {
        $('.m-benefit').append($.templates(r).render(e, rdHelper));
      })
    }else if (typeIdx == 1) {
      renderTmpl('/tmpl/benefit/edu.tmpl', function (r) {
        $('.m-benefit').append($.templates(r).render(e, rdHelper));
      })
    }
   
  }
}

$(BENEFIT.onReady);