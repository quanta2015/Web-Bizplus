const BASE = "http://47.111.22.103";
const BASE_API = "";

/* VARIABLE DEF */
const MASK = 1;
const NO_MASK = 0;


/* API DEF */
const GET_ALL_CAROUSELS = '/carousel/getAllCarousel';
const POST_COMMENT = '/addContact';


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

function nthIndexOf(str,c,num){
    var x=str.indexOf(c);
    for(var i=0;i<num;i++){
        x=str.indexOf(c,x+1);
    }
    return x;
}



// 根据语言数据设置DOm节点
function setLang(langDB) {
  e = langDB[langDB.cur]
  $("[data-locate]").each(function(m){
    d = $(this).data("locate")

    if (d.indexOf("[") != -1) {
      
      if(d.split("[").length-1>1) {
        if( d.split(".").length-1 >2 ) {
          // a.b[c].d[e].f
          fd0 = d.split(".")[0]
          fd1 = d.split(".")[1].split("[")[0]
          fd2 = d.split(".")[1].split("[")[1].split("]")[0]
          fd3 = d.split(".")[2].split("[")[0]
          fd4 = d.split(".")[2].split("[")[1].split("]")[0]
          fd5 = d.split(".")[3]
          ret = e[fd0][fd1][fd2][fd3][fd4][fd5]
        }else{
          // a.b[c].d[e]
          console.log(d)

          fd0 = d.split(".")[0]
          fd1 = d.split(".")[1].split("[")[0]
          fd2 = d.split(".")[1].split("[")[1].split("]")[0]


          console.log(e[fd0][fd1][fd2])
          fd3 = d.split(".")[2].split("[")[0]
          fd4 = d.split(".")[2].split("[")[1].split("]")[0]

          console.log(fd0 + ' ' + fd1 + ' ' + fd2 + ' ' + fd3 + ' '  + fd4)

          ret = e[fd0][fd1][fd2][fd3][fd4]
        }
      }else{
        if( d.split(".").length-1 >1 ) {
          if (nthIndexOf(d,'.',1)<d.indexOf("[")) {
            // a.b.c[d]
            fd0 = d.split(".")[0]
            fd1 = d.split(".")[1]
            fd2 = d.split(".")[2].split("[")[0]
            fd3 = d.split(".")[2].split("[")[1].split("]")[0]
            ret = e[fd0][fd1][fd2][fd3]
          }else{
            // a.b[c].d
            fd0 = d.split(".")[0]
            fd1 = d.split(".")[1].split("[")[0]
            fd2 = d.split(".")[1].split("[")[1].split("]")[0]
            fd3 = d.split(".")[2]
            ret = e[fd0][fd1][fd2][fd3]
          }
        }else{
          if( d.indexOf('.')<d.indexOf('[') ) {
            // a.b[c]
            fd0 = d.split(".")[0]
            fd1 = d.split(".")[1].split("[")[0]
            fd2 = d.split(".")[1].split("[")[1].split("]")[0]
            ret = e[fd0][fd1][fd2]
          }else{
            // a[b].c
            fd0 = d.split("[")[0]
            fd1 = d.substr(d.indexOf("[")+1,1)
            fd2 = d.split(".")[1]
            ret = e[fd0][fd1][fd2]
          }
        }
      }
    }else if (d.indexOf(".") != -1){
      if( d.split(".").length-1 >1 ) {
        // a.b.c
        fd0 = d.split(".")[0]
        fd1 = d.split(".")[1]
        fd2 = d.split(".")[2]
        ret = e[fd0][fd1][fd2]
      }else{
        // a.b
        fd0 = d.split(".")[0]
        fd1 = d.split(".")[1]
        ret = e[fd0][fd1]
      }
    }else{
      ret = e[d]
    }

    $(this).html(ret)
  })
}


function initGlobel(cb) {
  langDB = JSON.parse(localStorage.getItem("langDB"));

  if (!langDB && typeof(langDB)!="undefined" && langDB!=0) {
    cur = 'jp'
  }else{
    cur = langDB.cur
  }

  $.when(
      $.ajax('data/lang/cn.json'),
      $.ajax('data/lang/jp.json'),
      $.ajax('data/lang/en.json'))
      .done(function (e1, e2, e3) {
        langDB = {
          'cn': e1[0],
          'jp': e2[0],
          'en': e3[0],
          'cur': cur
        }
        localStorage.removeItem("langDB")
        localStorage.setItem("langDB",JSON.stringify(langDB))

        $('.m-lang span').removeClass('active')
        $(`.m-lang span[data-lang="${langDB['cur']}"]`).addClass('active')

        cb(langDB)
    })
  
  // if (!langDB && typeof(langDB)!="undefined" && langDB!=0) {
  //   $.when(
  //     $.ajax('data/lang/cn.json'),
  //     $.ajax('data/lang/jp.json'),
  //     $.ajax('data/lang/en.json'))
  //     .done(function (e1, e2, e3) {
  //       langDB = {
  //         'cn': e1[0],
  //         'jp': e2[0],
  //         'en': e3[0],
  //         'cur': 'jp'
  //       }
  //       localStorage.setItem("langDB",JSON.stringify(langDB))
  //       cb(langDB)
  //   })
  // }else{
  //   $('.m-lang span').removeClass('active')
  //   $(`.m-lang span[data-lang="${langDB['cur']}"]`).addClass('active')
  //   cb(langDB)
  // }
}


// 设置多国语言数据
function setGlobel(lang) {
  langDB = JSON.parse(localStorage.getItem("langDB"));
  langDB.cur = lang
  localStorage.setItem("langDB",JSON.stringify(langDB));
  setLang(langDB)
}


// 初始化语言菜单
function initLanguageMenu() {
  $('.m-lang span').on('click', function(){
    $('.m-lang span').removeClass('active')
    $(this).addClass('active')
    lang = $(this).data('lang')
    setGlobel(lang)
  })
}


// 渲染导航条
function renderMenu() {
  renderTmpl('/tmpl/nav/nav.tmpl', function (r) {
    $('nav').append(r);
    $.fn.bootstrapDropdownHover({});
    setLang(_langDB)
    // initGlobel()
  });
}


// 渲染页尾
function renderFoorter() {
  renderTmpl('/tmpl/footer/footer.tmpl', function (r) {
    $('footer').append(r);
    setLang(_langDB)
    // initGlobel()
  });
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
