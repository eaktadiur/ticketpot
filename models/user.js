var mongoose = require('mongoose');
var config = require('../conf/config');
var SHA256 = require("crypto-js/sha256");

mongoose.connect(config.dev.dbUrl, function(err){
	if(err) throw err;
	
});

var userSchema = new mongoose.Schema({
	username:String,
	name:String,
	email:{type:String, lowercase:true},
    password:String,
    userType: String,
	phone: String,
	dob: Date,
	gender: String,
    card : String,
    phone: String
	
});

userSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();
    user.password = SHA256(user.password);
			next();

});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, dbPassword, cb) {
    if(SHA256(candidatePassword) == dbPassword) cb(null, true);
    else cb(null, false);
	
};


module.exports = mongoose.model('User', userSchema);
