var mongoose = require('mongoose');
var config = require('../conf/config');

var gpsSchema = new mongoose.Schema({
	name:String,
    des:String,
    sex:String,
    duration:String,
    cor:String,
    age: String
});


module.exports = mongoose.model('GPS', gpsSchema);
