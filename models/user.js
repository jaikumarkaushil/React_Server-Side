// in these user model, we will keep the track of user login condition, whether he is logged in or not
// and if logged in, then type of user authentication, whether he is a normal user or administrator

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose'); // if mongoose for databases is not used in the project then passport-local is used for local authentication.

var User = new Schema({
    // moongose population should be used judicially
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    // username and password will be automatically added to the project with the use of passport local mongoose.
    // hash and salt were automatically added with passport local mongoose 
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);