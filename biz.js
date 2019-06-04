var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var superAgent = require('superagent');
var cheerio = require('cheerio');


var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/'));
app.set('view engine', 'html');

var __projdir = path.resolve(__dirname,'./');

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});



app.get('/news', function(req, res) {
  var url = 'https://www.msn.com/ja-jp/news/techandscience'
  var opt = {
      Referer: url,
      'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
  }
  superAgent.get(url).set(opt).end(function(err, response) {
      if (err) {
          console.log(err.status)
          return false;
      }
      if (response.status === 200) {
          var $ = cheerio.load(response.text)
          var newslist = $(".newlist").find('li')
          var sectlist = $('.sectionheadlines').find('li')
          var news = []
          savenews(newslist,news,$)
          savenews(sectlist,news,$)

          var ret ={
            "news": news
          }

          res.send(JSON.stringify(ret));
      } // end of res 
  }) // end of superagent
});



app.get('/search', function(req, res) {

  // var skey = '販売システム'
  var { skey, lang } = req.query
  var code = (skey==="")?0:1;

  if (code === 0) {
    res.send(JSON.stringify({"code": 0}));
  }else{
    var filename =  `${__projdir}/data/lang/${lang}.json`
    fs.readFile(filename,'utf-8', function(err,dat){
      if (err) console.log(err);

      var data = JSON.parse(dat);
      
      var achieveList = data.achieve.list
      var styleList = data.style.news_list
      var eduList = data.edu
      var careerList = data.careers
      var achieveRet = []
      var styleRet = []
      var eduRet = []
      var careerRet = []
      let searchMark = `<em class='m-search-key'>${skey}</em>`

      achieveList.map((obj)=>{
        sb = JSON.stringify(obj)
        if (sb.indexOf(skey)>0) {
          
          nb = JSON.parse(sb.split(skey).join(searchMark))
          achieveRet.push(nb)
        }
      })

      styleList.map((obj)=>{
        sb = JSON.stringify(obj)
        if (sb.indexOf(skey)>0) {
          nb = JSON.parse(sb.split(skey).join(searchMark))
          styleRet.push(nb)
        }
      })

      sb = JSON.stringify(eduList)
      if (sb.indexOf(skey)>0) {
        nb = JSON.parse(sb.split(skey).join(searchMark))
        eduRet= nb
      }

      sb = JSON.stringify(careerList)
      if (sb.indexOf(skey)>0) {
        nb = JSON.parse(sb.split(skey).join(searchMark))
        careerRet= nb
      }
      
      var ret = {
        "code": code,
        "achi":achieveRet,
        "style": styleRet,
        "edu":eduRet,
        "career":careerRet
      }

      res.send(JSON.stringify(ret));
    })
    
  }

});

app.post('/addContact', function (req, res) {
  var obj = {
    "name": req.body.name,
    "email": req.body.email,
    "tel": req.body.email,
    "title": req.body.title,
    "contact": req.body.contact,
    "type": req.body.type
  }

  switch(parseInt(obj.type)) {
    case 0: type = 'business'; break;
    case 1: type = 'career';   break;
    case 2: type = 'other';    break;
  }

  var date = moment().format("YYYYMMDDHHmmss")
  var filename =  `${__projdir}/data/${type}/${date}.json`
  var contact = JSON.stringify(obj)

  fs.writeFile(filename, contact, function (err) {
    if (err) console.error(err);
    var ret = { msg: `文件保存成功！` };
    res.send(JSON.stringify(ret));
  });
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var http = require('http');
var port = 1888;
app.set('port', port);
var httpServer = http.createServer(app);
httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}


function savenews(list,ret,$) {
  list.map((i,o)=>{
    if (typeof($(o).find('a>img').data('src')) === 'undefined') return;
    if (typeof($(o).find('a>div>p>img').data('src')) === 'undefined') return;
      
    var url = 'https://www.msn.com/' + $(o).find('a').attr('href')
    var img = 'http://' + $(o).find('a>img').data('src').default.split('//')[1]
    var title = $(o).find('div h3').text()
    var icon = 'http://' + $(o).find('a>div>p>img').data('src').default.split('//')[1]
    var from = $(o).find('a>div>p>span').eq(0).text()
    var item = {
        "url":url,
        "img":img,
        "title":title,
        "icon":icon,
        "from":from
    }
    ret.push(item)
  })
}