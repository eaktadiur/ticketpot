exports.index = function(req, res){
  res.render('rent/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.rent1 = function(req, res){
  res.render('rent/rent1', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.rent2 = function(req, res){
  res.render('rent/rent2', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.rent3 = function(req, res){
  res.render('rent/rent3', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};