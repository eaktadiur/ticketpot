var User = require('../models/user');

module.exports = function(passport) {
var config = require('../conf/config');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var WeiboStrategy = require('passport-weibo').Strategy;


passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findOne(id, function(err,user){
		done(null, user);
	});
});


passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password,user.password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {

        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

	
passport.use(new FacebookStrategy({
	clientID : config.dev.fb.clientID,
	clientSecret: config.dev.fb.clientSecret,
	callbackURL: config.dev.fb.callbackURL + 'auth/fb/callback'
}, function(accessToken, refreshToken, profile, done){
		process.nextTick(function(){
            var email = profile.username;
            if(profile.emails) email == profile.emails[0].value;                                                                                                                            
			var query = User.findOne({email:email});
			//console.log("facebook : " + JSON.stringify(profile));
			query.exec(function(err,user){
				if(user){
					console.log('user exist : ' + user.userId);
					done(null, user);
				}else {
					//console.log("facebook : " + profile.emails);
                    
					var newUser = new User();
					newUser.username = email;//profile.id;
					newUser.name = profile.displayName;
					newUser.email = email;
					newUser.userType = 'Customer';
					//console.log("facebook : " + newUser.email);
					newUser.save(function(err){
						if(err) throw err;
						done(null, newUser);
					})
				}
			});
		})
}

));

passport.use(new WeiboStrategy({
	clientID : config.dev.weibo.clientID,
	clientSecret: config.dev.weibo.clientSecret,
	callbackURL: config.dev.weibo.callbackURL + 'auth/weibo/callback'
}, function(accessToken, refreshToken, profile, done){
		process.nextTick(function(){
			var query = User.findOne({userId:profile.id});
			//console.log(profile.id);
			query.exec(function(err,user){
				if(user){
					//console.log('user exist : ' + user.userId);
					done(null, user);
				}else {
					//console.log(profile.displayName);
					var newUser = new User();
					newUser.userId = profile.emails[0].value;//profile.id;
					newUser.name = profile.displayName;
					newUser.email = profile.emails[0].value;
					newUser.userType = 'Customer';
					//console.log(newUser.email);
					newUser.save(function(err){
						if(err) throw err;
						done(null, newUser);
					})
				}
			});
		})
}

));

}