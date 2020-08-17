var express = require('express');

const bodyParser = require('body-parser');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username})
  .then((user) => {
    if(user != null) {
      var err = new Error('User ' + req.body.username + ' already exists!');
      err.status = 403;
      next(err);
    }
    else {
      return User.create({
        username: req.body.username,
        password: req.body.password});
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});
  }, (err) => next(err))
  .catch((err) => next(err));
});

// to track the user, to know whether a user is logged in or not
router.post('/login', (req, res, next) => {
  console.log(req.session.user);
  if (!req.session.user) {
  
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error('You are not authenticated!');

      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    // Buffer.from enables the split method, since authHeader is a string, we will split authHeader by space at position 1, the result will again be splited by : so as to retrive the username and password. The final output is an array of username and password.
    var username = auth[0];
    var password = auth[1];

    // if client/user is authenciated then it can view the next resources passing throung the middleware. 
    // If not, then the user will be challenged with www-Authenticate, Basic and it will move to the err handling part with next(err).
    User.findOne({username: username})
    .then((user) => {
      console.log(username);
      if( user === null) {
        var err = new Error('User ' + username + ' does not exist');
        
        res.setHeader('www-Authenticate', 'Basic');
        err.status = 403;
        return next(err);
      }
      else if (user.password != password) {
        var err = new Error('Your password is incorrect');
        err.status = 403;
        return next(err);
      }
      else if (user.username === username && user.password === password) {
        // res.cookie('user', 'admin', { signed: true})  // here we are registering the user with admin along with signed value for encryption
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain')
        res.end('You are authenticated');
      }
    })
    .catch((err) => next(err));
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated');
  }
})
// for logout
router.get('/logout', (req, res) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/'); // this will redirect the user once logged out
  } 
  else {
    var err = new Error('You are not logged in');
    res.statusCode = 403;
    next(err);
  }
})

module.exports = router;
