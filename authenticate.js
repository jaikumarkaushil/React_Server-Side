var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // strategy will be exported for local strategry authentication
var User = require('./models/user');
//since we are using mongoose for user authentication there the authorization will be handled by .authenticate method, otherwise we have to define auth function by ourself
exports.local = passport.use(new LocalStrategy(User.authenticate())); // User.authenticate will provide the required schema and model function that will enable the authorization
// the serialize and deserialize will enable the use of sessions in the project
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());