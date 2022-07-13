const mongoose = require('mongoose');
const reviewModel = mongoose.model('test_' + 'reviews', mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
        unique: true
    },
    review_source: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    },
    title: {
        type: String,
        default: ''
    },
    product_name: {
        type: String,
        default: 'Amazon Alexa',
    },
    reviewed_date: {
        type: Date,
        default: Date.now
    }
}));
module.exports=reviewModel
