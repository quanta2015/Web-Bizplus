const BASE = "http://47.111.22.103";
const BASE_API = "http://47.111.22.103/api";

/* VARIABLE DEF */
const MASK = 1;
const NO_MASK = 0;


/* API DEF */
const GET_ALL_CAROUSELS = '/carousel/getAllCarousel';


/* LODER DEF */
const LOADER = '<div class="mask" id="i-mask" style="position:absolute; top:0; left:0;right:0; bottom:0;z-index:9999999999;background:rgba(0,0,0, 0.15);display:flex;justify-content: center;align-items: center;"><div class="loaded"><div class="loaders "><div class="loader"><div class="loader-inner ball-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div></div></div>';


/* MSG DEF */
const MSG_COMMENT_SUCCESS = "提交留言成功！";
const MSG_ERROR = "网络出错！";


/* AJAX DEF */

function renderTmpl(tmpl, cb) {  
  $.ajax({url: tmpl, async: false}).then(function(e) { 
    cb(e);
  });
}

/**
 * 
 * @param {请求类型} method 
 * @param {请求API} url 
 * @param {请求数据} data 
 * @param {是否LOADING} isMask 
 * @param {回调} cb 
 */
function promise(method, url, data, isMask, cb) {
  isMask ? $('body').append(LOADER) : null;
  var promise = $.ajax({
    type: method,
    crossDomain: true,
    url: BASE_API + url,
    dataType: 'json',
    contentType: "application/json",
    data: data,
  });
  promise
    .then(function (e) {
      $('#i-mask').remove();
      cb(e);
    })
    .catch(function (err) {
      $('#i-mask').remove();
      console.log(err);
    });
}

/**
 * 
 * @param {请求类型} method 
 * @param {模版地址} tmpl 
 * @param {请求API} url 
 * @param {请求数据} data 
 * @param {是否LOADING} isMask 
 * @param {回调} cb 
 */
function promiseTmpl(method, tmpl, url, data, isMask, cb) {
  isMask ? $('body').append(LOADER) : null;
  $.when(
    $.ajax(tmpl),
    $.ajax({
      type: method,
      crossDomain: true,
      url: BASE_API + url,
      dataType: 'json',
      contentType: "application/json",
      data: data,
    })
  ).done(function (tmpl, e) {
    $("#i-mask").remove();
    cb(tmpl[0], e[0]);
  });
}

/**
 * 两个GET请求渲染一个tmpl
 * 
 * @param {模版地址} tmpl 
 * @param {请求第一个API} url_a 
 * @param {请求第二个API} url_b 
 * @param {是否LOADING} isMask 
 * @param {回调} cb 
 */
function promiseTmplWhen(tmpl, url_a, url_b, isMask, cb) {  
  isMask ? $('body').append(LOADER) : null;
  $.when(
    $.ajax(tmpl),
    $.ajax({
      type: 'GET',
      crossDomain: true,
      url: BASE_API + url_a,
      dataType: 'json',
      contentType: "application/json",
    }),
    $.ajax({
      type: 'GET',
      crossDomain: true,
      url: BASE_API + url_b,
      dataType: 'json',
      contentType: "application/json",
    }))
    .done(function (tmpl, e1, e2) {
      $("#i-mask").remove();
      cb(tmpl[0], e1[0], e2[0]);
    });
}


/* TMPL FUNC DEF */
var rdHelper = {
  formatTimeDay: function (t) {
    return moment(t).format("YYYY.MM.DD");
  },
  formatTimeMin: function (t) {
    return moment(t).format("YYYY/MM/DD HH:mm");
  },
  getSimpleContent: function (rich) {
    return rich.replace(/<(?:.|\n)*?>/gm, '');
  },
  formatImageURL: function (img) {  
    return BASE + '/' + img;
  },
  formatIconURL: function (img) {  
    img = img.replace('project_imgs','icon_project_imgs').toLowerCase() ;
    return BASE + '/' + img;
  },
  formatIconURLHonor: function (img) {  
    img = img.replace('honor/honor','icon/icon-honor');
    return BASE + '/' + img;
  }
}


/* OTHER FUNC DEF */
function encodeQuery(obj) {
  var params = [];
  Object.keys(obj).forEach(function (key) {
    var value = obj[key]
    if (typeof value === 'undefined') {
      value = '';
    }
    params.push([key, encodeURIComponent(value)].join('='))
  })
  return params.join('&')
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


function renderNav(index) {
  renderTmpl('/tmpl/nav/nav.tmpl', function (r) {
    $('.navbar').append(r);
    $('.nav-item').removeClass('active').eq(index).addClass('active');
  });
}

function renderFoorter() {
  renderTmpl('/tmpl/footer/footer.tmpl', function (r) {
    $('footer').append(r);
  });
}

function setLang() {
  $.getJSON(`lib/lang/${lang}.json`, function(e){
    $("[data-locate]").each(function(m){
      d = $(this).data("locate")
      $(this).text(e[d])
    })
  })
}

function initGlobel() {
  lang = localStorage.getItem("lang");
  if (!lang && typeof(lang)!="undefined" && lang!=0) {
    localStorage.setItem("lang","jp");
    lang = 'jp'
  }else{
    $('.m-lang span').removeClass('active')
    $(`.m-lang span[data-lang="${lang}"]`).addClass('active')
  }
  setLang()
}

function setGlobel(lang) {
  localStorage.setItem("lang",lang);
  setLang()
}

function initLanguageMenu() {
  $('.m-lang span').on('click', function(){
    $('.m-lang span').removeClass('active')
    $(this).addClass('active')
    lang = $(this).data('lang')
    setGlobel(lang)
  })
}




window.onload = function() {
    // 阻止双击放大
    var lastTouchEnd = 0;
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    });
    document.addEventListener('touchend', function(event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // 阻止双指放大
    document.addEventListener('gesturestart', function(event) {
        event.preventDefault();
    });
}
