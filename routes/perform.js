exports.index = function(req, res){
  res.render('perform/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated()});
};