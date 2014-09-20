var mongoose = require('mongoose');
var config = require('../conf/config');

var eventSchema = new mongoose.Schema({
	email:String,
	eventId: String,
	name:String,
	eventName:String,
	eventDesc : String,
	eventDuration: Number,
	hospitalName:String,
	phone:String,
	representName : String,
	address : String,
	price : String,
	subject : String,
	isActive : Boolean,
	imagePath : String,
    date: String
});


module.exports = mongoose.model('Event', eventSchema);
