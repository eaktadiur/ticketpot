exports.index = function(req, res){
  res.render('3rdpot/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};


