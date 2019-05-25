var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var moment = require('moment');

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/'));
app.set('view engine', 'html');

var __projdir = path.resolve(__dirname,'./');

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});


app.get('/search', function(req, res) {

  // var skey = '販売システム'
  var skey = req.query.skey
  var code = (skey==="")?0:1;

  if (code === 0) {
    res.send(JSON.stringify({"code": 0}));
  }else{
    var filename =  `${__projdir}/data/lang/jp.json`
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

      achieveList.map((obj)=>{
        sb = JSON.stringify(obj)
        if (sb.indexOf(skey)>0) {
          let searchMark = `<span class='m-search-key'>${skey}</span>`
          nb = JSON.parse(sb.split(skey).join(searchMark))
          achieveRet.push(nb)
        }
      })

      styleList.map((obj)=>{
        sb = JSON.stringify(obj)
        if (sb.indexOf(skey)>0) {
          let searchMark = `<span class='m-search-key'>${skey}</span>`
          nb = JSON.parse(sb.split(skey).join(searchMark))
          styleRet.push(nb)
        }
      })

      sb = JSON.stringify(eduList)
      if (sb.indexOf(skey)>0) {
        let searchMark = `<span class='m-search-key'>${skey}</span>`
        nb = JSON.parse(sb.split(skey).join(searchMark))
        eduRet= nb
      }

      sb = JSON.stringify(careerList)
      if (sb.indexOf(skey)>0) {
        let searchMark = `<span class='m-search-key'>${skey}</span>`
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
