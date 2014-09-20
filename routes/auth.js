var User = require('../models/user');

exports.index = function(req, res){
  res.render('auth/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};
exports.signin = function(req, res){
  res.render('auth/join', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};
exports.postsignin = function(req, res) {
    req.method = 'get'; 
    res.redirect('/');

}

exports.signout = function(req, res){
    req.logOut();
    req.session.authenticated = false;
    req.session.email = '';
    req.session.userType = '';
    res.redirect('/');
}

exports.signup = function(req, res){
  res.render('auth/signup', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};


exports.postsignup = function (req, res) {
  console.log('postsignup');
    var query = User.findOne({email : req.body.email});
    query.exec(function(err,user){
            
       if(err) throw err;
        if(user) { 
          req.method = 'get'; 
          res.redirect('/auth/signup');

        }
        else {
          var newUser = new User();
          newUser.username = req.body.email;
          newUser.name = req.body.name;
          newUser.email = req.body.email;
          newUser.password = req.body.password;
          newUser.phone = req.body.phone;
          newUser.userType = req.body.userType == '2' ? 'Merchant' : 'Customer';
          console.log(newUser);
          newUser.save(function(err){
            if(err) throw err;
               console.log(newUser);
            })
        }
        req.method = 'get'; 
        res.redirect('/');
            
    });    
        
}

exports.fb = function(req, res){
  next();
};

exports.fb = function(req, res){
  	req.session.email = req.user.email;
    res.render('index', {isAuthenticated: req.isAuthenticated()});
};

exports.weibo = function(req, res){
  next();
};

exports.weibo = function(req, res){
  	req.session.email = req.user.email;
    res.render('index', {isAuthenticated: req.isAuthenticated()});
};

