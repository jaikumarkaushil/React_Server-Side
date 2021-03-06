var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');  // express-session middleware  
var FileStore = require('session-file-store')(session);
//using express-session we no longer need cookie-parser for signed cookie, using session we can store the information for longer period
var passport = require('passport');
var authenticate = require('./authenticate');  // used methods of authenticate in this file.

var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

// mongoose is required to integrate our node application(REST API Server) with mongodb database
const mongoose = require('mongoose');

const Dishes = require('./models/dishes');
const { RequestHeaderFieldsTooLarge } = require('http-errors');

const url = config.mongoUrl;
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
// app.use(cookieParser('12324-53243-43333-54623'));  // we have used signed cookie with a secret key which enables the encryption of the cookie.


// seesion is removed with use of JSOn web token

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

// with use of JSON web token we will allow the user to get the request for all, only authenticated users will able to put, post and delete the data from rest endpoints.
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
