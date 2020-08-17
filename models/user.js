// in these user model, we will keep the track of user login condition, whether he is logged in or not
// and if logged in, then type of user authentication, whether he is a normal user or administrator

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// here we are defining the type of user authentication, and not tracking the user
var User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', User);