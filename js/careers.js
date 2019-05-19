
var CAREERS = {
  onReady: function () {
    renderMenu();
    renderFoorter();
    CAREERS.render();
    
  },

  render: function () {
    
    renderTmpl('/tmpl/careers/careers.tmpl', function (r) {
      $('.m-careers').append($.templates(r).render(e, rdHelper));
      // CONTACT.initMap();
    })
   
  }
}

$(CAREERS.onReady);