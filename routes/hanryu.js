exports.index = function(req, res){
  res.render('hanryu/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.hanryu1 = function(req, res){
  res.render('hanryu/hanryu1', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.hanryu2 = function(req, res){
  res.render('hanryu/hanryu2', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.hanryu3 = function(req, res){
  res.render('hanryu/hanryu3', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.hanryu4 = function(req, res){
  res.render('hanryu/hanryu4', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.hanryu5 = function(req, res){
  res.render('hanryu/hanryu5', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};