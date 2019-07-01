var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
var bodyParser = require('body-parser')
var moment = require('moment');
var superAgent = require('superagent');
var cheerio = require('cheerio');
var schedule = require('node-schedule');
var nodemailer = require('nodemailer')
var cors = require('cors')
var exphbs = require('express-handlebars');
var url = require('url')
var jwt= require('jsonwebtoken')
var formidable = require('formidable');

const configFile = `${__dirname}/data/config.json`
const config = JSON.parse(fs.readFileSync(configFile,'utf-8'))



var port = 80;
var secret = 'bizsecret';

//定时任务
// scheduleScanMail();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/')));

// app.set('view engine', 'html');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

var __projdir = path.resolve(__dirname,'./');

var hbs = exphbs.create({
  partialsDir: 'views/',
  layoutsDir: "views/layouts/",
  defaultLayout: 'layout',
  extname: '.hbs'
});

app.engine('hbs', hbs.engine);

app.get('/', function(req, res, next) {
  res.sendfile(__dirname + '/index.html');
  // res.render('index.html')
});

app.post('/saveall', function(req, res, next) {
  let langdb = req.body.langdb
  let config = req.body.config
  setSiteData(langdb)
  setConfigData(config)

  res.status(200).json({
    code: 200,
    msg: '保存成功'
  })
})

app.post('/upload', function(req, res, next) {
  var uploadFile = "";
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';                  //上传文件编码格式
  form.uploadDir = "upload";            //上传文件保存路径（必须在public下面新建）
  form.keepExtensions = true;               //保持上传文件后缀
  form.maxFieldsSize = 300 * 1024 * 1024;  
  form.parse(req);

  form
    .on('file', function(field, file) {
      uploadFile = file.path;                     //上传的文件数据
    })
    .on('end', function() {
      res.status(200).json({
        code: 200,
        msg: '上传成功',
        data:uploadFile
      })
    });
})


app.post('/login', function(req, res) {
  var {usr, pwd} = req.body
  if ((usr === 'aa')&&(pwd === 'bb')) {
    token = jwt.sign({ usr: usr, pwd: pwd }, secret);
    langdb = getSiteData()
    let config = getConfigData()
    res.status(200).json({
      code: 200,
      msg: '登录成功',
      data: {token: token, langdb: langdb, config:config}
    })
  }else{
    res.status(500).json({
      code: -1,
      msg: '登录失败',
      data: null,
    })
  }
})


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
    "tel": req.body.tel,
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


app.set('port', port);
var httpServer = http.createServer(app);
httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);



// var https = require('https');
// var options = {
//   key:fs.readFileSync('./key/1679788_manqc.top.key'),
//   cert:fs.readFileSync('./key/1679788_manqc.top.pem'),
//   ca:fs.readFileSync('./key/1679788_manqc.top.pem')
// }
// var httpsServer = https.createServer(options,app).listen(443);
// httpsServer.on('error', onError);


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

function sendMail(message,cb) {
  let transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: true,
    auth: {
      user: config.mail.user,
      pass: config.mail.pwd
    }
  })
  
  transporter.sendMail(message, (error, info) => {
    if (error) {
        console.log('Error occurred');
        console.log(error.message);
    }
    console.log('Message sent successfully!');
    transporter.close();
    cb()
  });
}


function scan(type) {
  let toMail;

  switch(type) {
    case 'business': toMail = config.mail.bussinessMail; break;
    case 'career':   toMail = config.mail.careerMail;    break;
    case 'other':    toMail = config.mail.otherMail;     break;
  }

  const path  = `${__dirname}/data/${type}/`;
  const bpath = `${__dirname}/data/backup/b`;
  const files = fs.readdirSync(path);

  files.forEach( (file, index) => {
    let fp   = `${path}${file}`;
    let bfp  = `${bpath}${file}`;
    let stat = fs.lstatSync(fp);
    if ((stat.isFile() === true)&&(file.split('.')[1] === 'json')) { 
      jsonData = JSON.parse(fs.readFileSync(fp,'utf-8'));
      let msg = {
        from: config.mail.user,
        to:   toMail,
        bcc:  toMail,
        subject: `${jsonData.title}`,
        text: `from: ${jsonData.name}<${jsonData.email}>\ntelephone:${jsonData.tel}\ncontact:\n${jsonData.contact}`
      };
      sendMail(msg, ()=>{
       fs.renameSync(fp, bfp)
      })
    }
  })
}


function  scheduleScanMail() {
  var rule = new schedule.RecurrenceRule(); 
  rule.minute = [0, 15, 30, 45];  
  schedule.scheduleJob(rule,()=>{
    scan('business')
    scan('career')
    scan('other')
  }); 
}


function getConfigData() {
  return JSON.parse(fs.readFileSync(configFile,'utf-8'))
}

function setConfigData(data) {
  fs.writeFileSync(configFile,JSON.stringify(data),'utf-8')
}


function getSiteData() {
  const lang = ['cn','jp','en']
  let ret = {}

  lang.map((e,i)=>{
    // console.log(e)
    let filename = `${__projdir}/data/lang/${e}.json`
    let jsonData = JSON.parse(fs.readFileSync(filename,'utf-8'))
    ret[e] = jsonData
  })
  return ret
}


function setSiteData(data) {
  const lang = ['cn','jp','en']

  lang.map((e,i)=>{
    let filedata = JSON.stringify(data[e])
    let filename = `${__dirname}/data/lang/${e}.json`
    fs.writeFileSync(filename,filedata,'utf-8')
  })
}
