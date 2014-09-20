var mongoose = require('mongoose');
var config = require('../conf/config');

var ratingSchema = new mongoose.Schema({
	email:String,
    path:String,
    date: String,
    rating: Number,
    comment: String
});


module.exports = mongoose.model('Rating', ratingSchema);
