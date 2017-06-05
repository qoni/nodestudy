var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config=require('./config');

//初始化mongodb
require("./init/mongodb");

var admin = require('./routes/admin');

var app = express();

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//解析中间件
app.use(logger('dev'));
//解析post
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//解析Cookies
app.use(cookieParser());
//静态文件
app.use(express.static(path.join(__dirname, 'public')));

//注册路由
app.use('/', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(config.port);

// var Article=require("./models/Article");
// var a=new Article({
//   title:"测试标题",
//   body:"测试内容",
//   date:new Date()
// });
// a.save(function(err,ret){
//   console.log(err,ret)
// });