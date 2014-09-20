exports.index = function(req, res){
  res.render('sim/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};