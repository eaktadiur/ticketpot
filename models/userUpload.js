var mongoose = require('mongoose');
var config = require('../conf/config');

var userUploadSchema = new mongoose.Schema({
	email:String,
    path:String,
    uploadType:String,
    date: String
});


module.exports = mongoose.model('UserUpload', userUploadSchema);
