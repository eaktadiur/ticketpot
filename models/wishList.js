var mongoose = require('mongoose');
var config = require('../conf/config');

var wishListSchema = new mongoose.Schema({
	email:String,
    address:String,
    amount: String,
    desc: String,
    date: String
});


module.exports = mongoose.model('WishList', wishListSchema);
