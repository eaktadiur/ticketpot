var mongoose = require('mongoose');
var config = require('../conf/config');

var recommendatorSchema = new mongoose.Schema({
	email:String,
    text:String,
    date: String
});


module.exports = mongoose.model('Recommendator', recommendatorSchema);
