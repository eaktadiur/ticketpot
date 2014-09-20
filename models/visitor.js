var mongoose = require('mongoose');
var config = require('../conf/config');

var visitorSchema = new mongoose.Schema({
	ip:String,
    date: String
});


module.exports = mongoose.model('Visitor', visitorSchema);
