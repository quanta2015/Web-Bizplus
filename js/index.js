var _langDB;

var INDEX = {
  onReady: function () {
    initGlobel(function(langDB) {
      _langDB = langDB;
      renderMenu();
      renderFoorter();
      initLanguageMenu();

      INDEX.renderCarousel();
      INDEX.renderCard();
      INDEX.renderNews();
    })
  },

  renderNews: function() {
    promiseTmpl('get','/tmpl/index/news.tmpl','/news',null,MASK,function (r,d) {
      console.log(r)
      // data = { "news": d }
      $('.m-news').append($.templates(r).render(d, rdHelper));
    });
    // renderTmpl('/tmpl/index/news.tmpl',function (r) {
    //   data = { "news": _langDB[_langDB.cur]['home_news'] }
    //   $('.m-news').append($.templates(r).render(data, rdHelper));
    // });
  },

  renderCard: function() {
    renderTmpl('/tmpl/index/cards.tmpl',function (r) {
      data = { "cards": _langDB[_langDB.cur]['home_card'] }
      $('.m-cards').append($.templates(r).render(data, rdHelper));
    });
  },

  renderCarousel: function() {
    data = { "carousels": _langDB[_langDB.cur]['home_carousels'] }
    $('#index-carousel>.carousel-inner').append($('#carouselItem').render(data, rdHelper));
    $('#index-carousel>.carousel-indicators').append($('#carouselIndicators').render(data, rdHelper));
    
  }
}

$(INDEX.onReady);


