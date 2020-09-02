var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // strategy will be exported for local strategry authentication
var User = require('./models/user');

var JwtStrategy = require('passport-jwt').Strategy; // to define the JWT strategy
var ExtractJwt = require('passport-jwt').ExtractJwt; // to extract the jSON web token from header, body or url
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config');
//since we are using mongoose for user authentication there, the authorization will be handled by .authenticate method, otherwise we have to define auth function by ourself

exports.local = passport.use(new LocalStrategy(User.authenticate())); // User.authenticate will provide the required schema and model function that will enable the authorization
// the serialize and deserialize will enable the use of sessions in the project
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 3600});   // duration of login at which it got expired
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
        (jwt_payload, done) => {
            console.log("JWT payload: ", jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                else if (user) {
                    return done(null, user);
                }
                else{
                    return done(null, false);
                }
            })
        }// done is callback provided by jwt
    ));

exports.verifyUser = passport.authenticate('jwt', {session: false}); // this will verify the user once authenticated.
