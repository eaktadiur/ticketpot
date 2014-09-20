var mongoose = require('mongoose');
var config = require('../conf/config');

var albumSchema = new mongoose.Schema({
	email:String,
    path:String,
    date: String
});


module.exports = mongoose.model('Album', albumSchema);
