exports.index = function(req, res){
  res.render('music/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.music2 = function(req, res){
  res.render('music/music2', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};


exports.music9 = function(req, res){
  res.render('music/music9', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};


exports.music10 = function(req, res){
  res.render('music/music10', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};


exports.music11 = function(req, res){
  res.render('music/music11', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};