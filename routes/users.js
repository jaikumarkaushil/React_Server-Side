var express = require('express');

const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// previously, the authentication was handled by the headers of the request but with the use of passport, we are sending the information in body of the request
router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), // .register is mongoose plugin on schemas defined
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => { // passport module is used here. when the user is authenticated then only the next function will be executed, otherwise , the function handles the response - (req, res, () => {})
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'}); // the success flag will help in the client side for quickly undertake the state of registration status.
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {  // the next is not required for handling the error since the body will have the response, retrieving which we can track the user.
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'});
});
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
