exports.index = function(req, res){
  res.render('news/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.news1 = function(req, res){
  res.render('news/news1', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.news1_1 = function(req, res){
  res.render('news/news1_1', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.news2 = function(req, res){
  res.render('news/news2', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.news3 = function(req, res){
  res.render('news/news3', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.news4 = function(req, res){
  res.render('news/news4', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.news5 = function(req, res){
  res.render('news/news5', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.news5_1 = function(req, res){
  res.render('news/news5_1', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};