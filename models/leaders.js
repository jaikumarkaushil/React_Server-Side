const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type:  String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Model for the schema
var Leaders = mongoose.model('Leader', leaderSchema);

// mongoose will automatically define the plural of 'Dish', as collection of the document Dish

module.exports = Leaders;