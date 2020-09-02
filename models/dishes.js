const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

// we have defined the schema her
const commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // reference to user model Id, by this we would connect the two documents in MongoDB but it should be use judicially since it may cause searching which will degrade the performance
    }
}, {
    timestamps: true
});

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type:  Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments:[commentSchema]
}, {
    timestamps: true
});
// Model for the schema
var Dishes = mongoose.model('Dish', dishSchema);

// mongoose will automatically define the plural of 'Dish', as collection of the document Dish

module.exports = Dishes;