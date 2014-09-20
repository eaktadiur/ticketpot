var mongoose = require('mongoose');
var config = require('../conf/config');

var orderSchema = new mongoose.Schema({
	orderId:String,
	email:String,
	paymentId:String,
    state:String,
    amount: Number,
    qty:Number,
    total: Number,
    desc: String,
    orderDate: String,
    payerEmail: String,
    payerName: String,
    payerId : String,
    paymentMethod: String,
    shippingAddress: String,
    //details: {email : String, method : String, firstName: String, lastName : String, payerId : String, address : [{}]}
});


module.exports = mongoose.model('Order', orderSchema);






