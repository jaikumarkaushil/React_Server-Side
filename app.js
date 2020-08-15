var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

// mongoose is required to integrate our node application(REST API Server) with mongodb database
const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

connect.then((db) => {
  console.log('Connected correctly to server')
}, (err) => {console.log(err); })

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function auth(req, res, next) {
  console.log(req.headers);

  var authHeader = req.headers.authorization;

  if (!authHeader) {
    var err = new Error('You are not authenticated!');
    
    res.setHeader('www-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }
  console.log(authHeader);

  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  // Buffer enables the split method, since authHeader is a string, we will split authHeader by space at position 1, the result will again be splited by : so as to retrive the username and password. The final output is an array of username and password.
  var username = auth[0];
  var password = auth[1];

  // if client/user is authenciated then it can view the next resources passing throung the middleware. 
  // If not, then the user will be challenged with www-Authenticate, Basic and it will move to the err handling part with next(err).
  if (username === 'admin' && password === 'password') {
    next();  //from this, the next middleware will be executed which is after the app.use(auth)
  }
  else{
    var err = new Error('You are not authenticated!');
    
    res.setHeader('www-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }
}

app.use(auth);
// at this point, it is required to have authorization so that the client can access any of the contents after this point
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);


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

module.exports = app;
