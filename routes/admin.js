var Visitor = require('../models/visitor');
var User = require('../models/user');
var Utils = require('../libs/utils');
var Event = require('../models/event');
var Order = require('../models/order');
var Recommendator = require('../models/recommendator');
var UserUpload = require('../models/userUpload');
var Album = require('../models/album');


exports.index = function(req, res){
  var query = User.find();
  var userCount = 0;
  var visitorCount = 0;
  var recommendatorCount = 0;
  var albumCount = 0;
  var pictureCount = 0;
  var orderCount = 0;
  var eventCount = 0;
    query.exec(function(err,users){
      userCount = users.length;
      query = Visitor.find();
      query.exec(function(err,visitors){
        visitorCount = visitors.length;
          query = Order.find();
          query.exec(function(err,orders){
            orderCount = orders.length;
            query = Recommendator.find();
            query.exec(function(err,recommendators){
              recommendatorCount = recommendators.length;
              query = Album.find();
              query.exec(function(err,albums){
                albumCount = albums.length;
                query = UserUpload.find();
                query.exec(function(err,pictures){
                  pictureCount = pictures.length;
                  query = Event.find();
                query.exec(function(err,events){
                  eventCount = events.length;
                    res.render('admin/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated(), userCount : userCount, visitorCount : visitorCount, orderCount: orderCount, recommendatorCount : recommendatorCount, pictureCount : pictureCount, albumCount : albumCount, eventCount:eventCount });
                });});
              });
            });
          });
      });
    });
  
};

exports.users = function(req, res){
	var query = User.find();
		query.exec(function(err,users){
			res.render('admin/users', { title: '3rdpot', isAuthenticated: req.isAuthenticated(), users : users });			
		});
  
};

exports.visitors = function(req, res){
        var now = Utils.getKST();
        var count = 0;
        var query = Visitor.find();
		query.exec(function(err,visitors){
          visitors.forEach(function(obj){
            if(obj.date == now.split('T')[0])            
                    count++;
             });
	      res.render('admin/visitors', { title: '3rdpot', isAuthenticated: req.isAuthenticated(), visitor : { total : visitors.length, today: count} });
        });
       
};

