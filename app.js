require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var hbs=require('express-handlebars')
var db=require('./config/connection')
var session=require('express-session')
// var fileUpload= require('express-fileupload')
const multer=require('multer');
var app = express();
const fileStorageEngine=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./public/product-images')

  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+'--'+file.originalname);
  },
});
const upload=multer({storage:fileStorageEngine})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({helpers:{inc:function(value,options){return parseInt(value)+1;}}, extname: 'hbs', defaultLayout: 'user-layout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/' }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(fileUpload())
app.post('/multiple',(req,res)=>{
  console.log(req.files);
  res.send('multiple');
})
app.use(session({secret:"Key",cookie:{maxAge:600000}}))
app.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

db.connect((err)=>{
  if(err) console.log("connection error"+err);
  else console.log("Database connected");

})

app.use('/', userRouter);
app.use('/admin', adminRouter);

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
  res.render('user/error');
});

module.exports = app;
