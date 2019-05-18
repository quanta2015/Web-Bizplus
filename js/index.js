
var INDEX = {
  onReady: function () {
    INDEX.renderCarousel();
    INDEX.renderCard();
    INDEX.renderNews();
    renderMenu();
    renderFoorter();
    initLanguageMenu();
  },

  renderNews: function() {
    promiseTmpl('GET', '/tmpl/index/news.tmpl', GET_ALL_CAROUSELS, null, MASK, function (r, e) {
      e = {
            news: [{
              date: "2019.04.01",
              tl: "コーポレート",
              content: "コーポレートサイトをリニューアルオープンしました"
            }, {
              date: "2019.04.01",
              tl: "コーポレート",
              content: "コーポレートサイトをリニューアルオープンしました"
            }, {
              date: "2019.04.01",
              tl: "コーポレート",
              content: "コーポレートサイトをリニューアルオープンしました"
            }]
          }

        $('.m-news').append($.templates(r).render(e, rdHelper));
    });
  },

  renderCard: function() {
    promiseTmpl('GET', '/tmpl/index/cards.tmpl', GET_ALL_CAROUSELS, null, MASK, function (r, e) {
      e = {
            cards: [{
              tl: "会社概要",
              el: "Company Profile",
              img: "imgs/card01.jpg",
              desc: "弊社のご紹介"
            }, {
              tl: "事業概要",
              el: "Business Profile",
              img: "imgs/card02.jpg",
              desc: "外国人派遣事業、ソフトウェア受託事業、コンサルタント事業など、幅広いソリューションをご提供いたします。"
            }, {
              tl: "採用情報",
              el: "Recruitment info",
              img: "imgs/card03.jpg",
              desc: "エンジニアおよび一般職の募集をしております。事業拡大に伴い、新卒・第二新卒・中途採用にも力を入れて採用しています。"
            }, {
              tl: "社员福利",
              el: "Member benefits",
              img: "imgs/card04.jpg",
              desc: "社員が享受する教育、医療、旅行の福祉。"
            }]
          }

        $('.m-cards').append($.templates(r).render(e, rdHelper));
    });
  },

  renderCarousel: function() {
    promiseTmpl('GET', '/tmpl/index/carousel.tmpl', GET_ALL_CAROUSELS, null, MASK, function (r, e) {
      e = { carousels: [
            {
              imgw: "imgs/carousel01w.jpg",
              imgm: "imgs/carousel01m.jpg",
              title: "Bizplus",
              desc: "お客様のビジネスのプラスになる役割を果たす"},
            {
              imgw: "imgs/carousel02w.jpg",
              imgm: "imgs/carousel02m.jpg",
              title: "Bizplus",
              desc: "新しい技術に絶えず挑戦し、ユニークな発想を大切にする"},
            {
              imgw: "imgs/carousel03w.jpg",
              imgm: "imgs/carousel03m.jpg",
              title: "Bizplus",
              desc: "お客様のビジネスのプラスになる役割を果たす"}] 
          }

      // $('#index-carousel').append($.templates(r).render(e, rdHelper));

      $('#index-carousel>.carousel-inner').append($('#carouselItem').render(e, rdHelper));
      $('#index-carousel>.carousel-indicators').append($('#carouselIndicators').render(e, rdHelper));

      // $('#index-carousel').carousel({interval: 1000})
      // console.log('call')
    });
  },

  renderMenu: function() {
    renderTmpl('/tmpl/nav/nav.tmpl', function (r) {
      $('nav').append(r);
      $.fn.bootstrapDropdownHover({});
      initGlobel()
    });
  }
}

$(INDEX.onReady);


