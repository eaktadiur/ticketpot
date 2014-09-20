var Utils = require('../libs/utils');
var GPS = require('../models/gps');
var Event = require('../models/event');
var Order = require('../models/order');
var Recommendator = require('../models/recommendator');
var UserUpload = require('../models/userUpload');
var Album = require('../models/album');


exports.index = function(req, res){
  var query = Order.find({email:req.session.email});
  var recommendatorCount = 0;
  var albumCount = 0;
  var pictureCount = 0;
  var orderCount = 0;
  var eventCount = 0;
    
          query.exec(function(err,orders){
            orderCount = orders.length;
            query = Recommendator.find({email:req.session.email});
            query.exec(function(err,recommendators){
              recommendatorCount = recommendators.length;
              query = Album.find({email:req.session.email});
              query.exec(function(err,albums){
                albumCount = albums.length;
                query = UserUpload.find({email:req.session.email});
                query.exec(function(err,pictures){
                  pictureCount = pictures.length;
                  query = Event.find({email:req.session.email});
                query.exec(function(err,events){
                  eventCount = events.length;
                    res.render('customer/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated(), orderCount: orderCount, recommendatorCount : recommendatorCount, pictureCount : pictureCount, albumCount : albumCount, eventCount:eventCount });
                });});
              });
      });
    });
  
};

exports.gpsroute = function(req, res){
       
        console.log(req.params.gpsName);
        var gpsName = req.params.gpsName;
        var query = GPS.findOne({'name': gpsName});
        
		query.exec(function(err,gps){
                console.log(gps);
                res.json(gps);    
         });
	
};