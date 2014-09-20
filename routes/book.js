exports.index = function(req, res){
  res.render('book/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};
exports.book1 = function(req, res){
  res.render('book/book1', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};