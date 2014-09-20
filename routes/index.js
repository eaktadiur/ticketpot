
var Visitor = require('../models/visitor');
var User = require('../models/user');
var Utils = require('../libs/utils');
var Order = require('../models/order');
var Recommendator = require('../models/recommendator');
var Wishlist = require('../models/wishList');
var UserUpload = require('../models/userUpload');
var Album = require('../models/album');
var Rating = require('../models/rating');
var uuid = require('node-uuid');
var path = require('path');
var fs =require('fs');

exports.index = function(req, res){
	
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var now = Utils.getKST();
        var query = Visitor.find({ip:ip, date:now.split('T')[0]})
        console.log(ip + "  - " + now)
        query.exec(function(err,v){
           if(err) throw err;
           console.log(v.length);
           if(v.length == 0){
                var visitor = new Visitor();
                visitor.ip = ip;
                visitor.date = now.split('T')[0];
	            visitor.save(function(err){
	    	        if(err) throw err;
			
	            })  
            }
        })  
      res.render('index', { isAuthenticated: req.isAuthenticated()});
                  

};

exports.dashboard = function(req, res) {
  var query = User.findOne({email:req.session.email});
  query.exec(function(err,user){
        if (err) throw err;
        else {
            if(user.userType=='Customer')
              res.redirect('/customer');
            else if(user.userType=='Merchant')
              res.redirect('/merchant');
            else if(user.userType=='Admin')
              res.redirect('/admin');
                
       }
    });
          
}

exports.orders = function(req, res){
  var query = User.findOne({email:req.session.email});
  query.exec(function(err,user){
        if (err) throw err;
        else {
            
            if(user.userType=='Admin'){
              query = Order.find();
            } else{
                query = Order.find({email:req.session.email});
            }

            query.exec(function(err,orders){
              res.render('index/orders', { title: '3rdpot', isAuthenticated: req.isAuthenticated(), orders : orders });
            });    
       }
    });
  
};

exports.wishlists = function(req, res){
  var query = Wishlist.find({email:req.session.email});
    query.exec(function(err,wishlists){
        res.render('index/wishlist', { title: '3rdpot', isAuthenticated: req.isAuthenticated(), wishlists : wishlists });
    });
  
};

exports.wishlist = function(req, res){
    var now = Utils.getKST();
    var newWishList = new Wishlist();
    newWishList.address = "";
    newWishList.email = req.session.email;
    newWishList.amount = req.query.amount;
    newWishList.desc = req.query.desc;
    newWishList.date = now;
    newWishList.save(function(err){
      if(err) throw err;
    })
    res.redirect('/wishlists');
  
};

exports.recommendators = function(req, res){

  var query = User.findOne({email:req.session.email});
  query.exec(function(err,user){
        if (err) throw err;
        else {
            
            if(user.userType=='Admin'){
              query = Recommendator.find();
            } else{
                query = Recommendator.find({email:req.session.email});
            }

            query.exec(function(err,recommendators){
              res.render('index/recommendators', { title: '3rdpot', isAuthenticated: req.isAuthenticated(), recommendators : recommendators, user:user });
            });    
       }
    });
  
    
};
exports.recommendator = function(req, res){
  res.render('index/recommendator', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};
exports.postrecommendator = function(req, res){
    var now = Utils.getKST();
    var recommendator = new Recommendator();
    recommendator.email = req.session.email;
    recommendator.text = req.body.text;
    recommendator.date = now;
    recommendator.save(function(err){
    if(err) throw err;
      
    })
    req.method='get';
    res.redirect('/recommendators');
};


exports.pictures = function(req, res){
  var query = User.findOne({email:req.session.email});
  query.exec(function(err,user){
        if (err) throw err;
        else {
            
            if(user.userType=='Admin'){
              query = UserUpload.find();
            } else{
                query = UserUpload.find({email:req.session.email});
            }

            query.exec(function(err,pictures){
              res.render('index/pictures', { title: '3rdpot', isAuthenticated: req.isAuthenticated(), pictures : pictures });
            });
       }
    });
  
};

exports.picture = function(req, res){
    res.render('index/picture', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
}

exports.postpicture = function(req, res){
      console.log("files : " + req.files.picture.path + " uploadtype : " + req.body.uploadtype );
      var now = Utils.getKST();
      var upload = new UserUpload();
      upload.email = req.session.email;
      upload.uploadType = req.body.uploadtype;
      upload.path = req.files.picture.path;
      upload.date = now;
      upload.save(function(err){
        if(err) throw err;
      
      })
      req.method='get';
      res.redirect('/pictures');
}

exports.albums = function(req, res){
  var query = User.findOne({email:req.session.email});
  query.exec(function(err,user){
        if (err) throw err;
        else {
            
            if(user.userType=='Admin'){
              query = Album.find();
            } else{
                query = Album.find({email:req.session.email});
            }

            query.exec(function(err,albums){
              res.render('index/albums', { title: '3rdpot', isAuthenticated: req.isAuthenticated(), albums : albums });
            });
       }
    });
  
};
exports.album = function(req, res){
  res.render('index/album', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};

exports.postalbum = function(req, res){
    var pictureId = uuid.v4();
    console.log('pictureId : ' + pictureId);
     var path = "./public/images/uploads/" + pictureId + ".png";
     if ( 'albumImg' in req.body ) {

        var base64Image = req.body.albumImg.replace(/^data:image\/png;base64,/,"");
        fs.writeFile(path, base64Image, 'base64', function(err) { 
            
            if(err) {
                console.log(err);
            } else {
                var now = Utils.getKST();
                var album = new Album();
              album.email = req.session.email;
                album.path = path;
                album.date = now;
              album.save(function(err){
                if(err) throw err;
              })
            }
        }); 
    }
    req.method='get';
    res.redirect('/albums');

}

exports.rating = function(req, res){
    console.log('query rating : ' + req.query.path);
    var query = Rating.find({path : req.query.path});
    query.exec(function(err,ratings){
        res.json(ratings);
    });

}

exports.overallrating = function(req, res){
    console.log('query rating : ' + req.query.path);
    var query = Rating.find({path : req.query.path});
    var total = 0;
    query.exec(function(err,ratings){
      ratings.forEach(function(obj){
                      total += obj.rating;
      });
      res.json({rating: Math.round(total/ratings.length)});
    });

}


exports.postrating = function(req, res){
      var now = Utils.getKST();
      var rating = new Rating();
      rating.email = req.session.email;
      rating.rating = req.body.rating;
      rating.comment = req.body.comment;
      rating.path = req.body.path;
      rating.date = now;
      rating.save(function(err){
        if(err) throw err;
      
      })
      req.method='get';
      res.json({overallrating : 4});
}

