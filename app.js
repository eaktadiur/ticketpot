process.env.TMP = './public/images/uploads';
var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
//var flash    = require('connect-flash');
//var SHA256 = require("crypto-js/sha256");
var http = require('http');
var path = require('path');
var fs =require('fs');



var User = require('./models/user');

var admin = require('./routes/admin');
var book = require('./routes/book');
var customer = require('./routes/customer');
var hanryu = require('./routes/hanryu');
var merchant = require('./routes/merchant');
var movie = require('./routes/movie');
var music = require('./routes/music');
var news = require('./routes/news');
var perform = require('./routes/perform');
var rent = require('./routes/rent');
var salemedi = require('./routes/salemedi');
var home = require('./routes/index');
var auth = require('./routes/auth');
var sim = require('./routes/sim');
var rdpot = require('./routes/3rdpot');
var gpsroute = require('./routes/gpsroute');
var paypal = require('./routes/paypal');

require('./libs/passport')(passport);

var app = express();




try {
    var configJSON = fs.readFileSync(__dirname + "/conf/paypal.json");
    var config = JSON.parse(configJSON.toString());
    paypal.init(config);
} catch(e) {
    console.error("File paypal.json not found or is invalid: " + e.message);
    process.exit(1);
}




app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.compress());
app.use(express.cookieParser());
app.use(express.session({secret:'jikuy213rdpot'}));
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
//app.use(flash());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', home.index);
app.get('/dashboard', ensureAuthenticated, home.dashboard);

app.get('/admin', ensureAuthenticatedAdmin, admin.index);
app.get('/admin/users', ensureAuthenticatedAdmin, admin.users);
app.get('/admin/recommendators', ensureAuthenticatedAdmin, home.recommendators);
app.get('/admin/events', ensureAuthenticatedAdmin, merchant.events);
app.get('/admin/visitors', ensureAuthenticatedAdmin, admin.visitors);
app.get('/admin/orders', ensureAuthenticatedAdmin, home.orders);
app.get('/admin/pictures', ensureAuthenticatedAdmin, home.pictures);
app.get('/admin/albums', ensureAuthenticatedAdmin, home.albums);

app.get('/customer', ensureAuthenticatedCustomer, customer.index);

app.get('/orders', ensureAuthenticated, home.orders);
app.get('/albums', ensureAuthenticated, home.albums);
app.get('/recommendators', ensureAuthenticated, home.recommendators);
app.get('/pictures', ensureAuthenticated, home.pictures);
app.get('/wishlists', ensureAuthenticated, home.wishlists);
app.get('/wishlist', ensureAuthenticated, home.wishlist);


app.get('/picture', ensureAuthenticated, home.picture);
app.post('/postpicture', ensureAuthenticated, home.postpicture);

app.get('/album', ensureAuthenticated, home.album);
app.post('/postalbum', ensureAuthenticated, home.postalbum);

app.get('/recommendator', ensureAuthenticated, home.recommendator);
app.post('/postrecommendator', ensureAuthenticated, home.postrecommendator);

app.get('/merchant', ensureAuthenticatedMerchant, merchant.index);
app.get('/merchant/events', ensureAuthenticatedMerchant, merchant.events);
app.get('/merchant/event', ensureAuthenticatedMerchant, merchant.event);
app.post('/merchant/postevent', ensureAuthenticatedMerchant, merchant.postevent);

app.get('/auth/signup', auth.signup);
app.get('/auth/join', auth.signin);
app.get('/auth/signout', auth.signout);
app.get('/auth/profile', paypal.profile);
app.post('/auth/postprofile', paypal.postprofile);

app.post('/auth/postsignup', auth.postsignup);
app.post('/auth/postsignin', function(req, res, next) {
    console.log('/auth/postsignin');
    passport.authenticate('local', function(err, user, info) {
    console.log(user);
    console.log(err);
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      	req.method = 'get'; 
        return res.redirect("/auth/join");    
    }
    req.logIn(user, function(err) {
        if (err) { return next(err); }
        
        req.session.email = user.email;
        req.session.userType = user.userType;
        req.method = 'get'; 
        console.log(user.userType);
        if(user.userType=='Admin')
        {
            return res.redirect("/admin");
        }
        else if(user.userType=='Customer')
        {
            return res.redirect("/customer");
        }
        else if(user.userType=='Merchant')
        {
            return res.redirect("/merchant");
        }
        
    });
  })(req, res, next);
});


app.get('/order', ensureAuthenticated, paypal.order);
app.get('/paypal', ensureAuthenticated, paypal.paypal);
app.get('/creditcard', ensureAuthenticated, paypal.creditcard);
app.get('/orderexecute',ensureAuthenticated, paypal.orderexecute);
app.get('/orderconfirm',ensureAuthenticated, paypal.orderconfirm);


app.get('/auth/fb', passport.authenticate('facebook', {scope:'email'}), auth.fb);
app.get('/auth/fb/callback', passport.authenticate('facebook', {failureRedirect : '/auth/join'}), auth.fb);
app.get('/auth/weibo', passport.authenticate('weibo', {scope:'email'}));
app.get('/auth/weibo/callback', passport.authenticate('weibo', {failureRedirect : '/auth/join'}), auth.weibo);

app.get('/overallrating', home.overallrating);
app.get('/rating', home.rating);
app.post('/postrating', ensureAuthenticated, home.postrating);

app.get('/movie', movie.index);
app.get('/movie/movie1', movie.movie1);
app.get('/movie/movie2', movie.movie2);
app.get('/movie/movie2_1', movie.movie2_1);
app.get('/movie/movie3', movie.movie3);
app.get('/movie/movie4', movie.movie4);
app.get('/movie/movie5', movie.movie5);
app.get('/movie/movie6', movie.movie6);
app.get('/movie/movie7', movie.movie7);
app.get('/movie/movie8', movie.movie8);
app.get('/movie/movie9', movie.movie9);
app.get('/movie/movie10', movie.movie10);
app.get('/movie/movie11', movie.movie11);
app.get('/movie/movie12', movie.movie12);
app.get('/movie/movie13', movie.movie13);
app.get('/movie/movie14', movie.movie14);
app.get('/movie/movie15', movie.movie15);
app.get('/movie/movie16', movie.movie16);
app.get('/movie/movie17', movie.movie17);
app.get('/movie/movie18', movie.movie18);
app.get('/movie/movie19', movie.movie19);
app.get('/movie/movie20', movie.movie20);
app.get('/movie/movie21', movie.movie21);
app.get('/movie/movie1_1', movie.movie1_1);
app.get('/movie/movie1_2', movie.movie1_2);
app.get('/movie/movie1_3', movie.movie1_3);
app.get('/movie/movie1_4', movie.movie1_4);
app.get('/movie/movie1_5', movie.movie1_5);
app.get('/movie/movie1_6', movie.movie1_6);
app.get('/movie/movie1_7', movie.movie1_7);
app.get('/movie/movie1_8', movie.movie1_8);
app.get('/movie/movie1_9', movie.movie1_9);
app.get('/movie/movie1_10', movie.movie1_10);
app.get('/movie/movie1_11', movie.movie1_11);
app.get('/movie/movie1_12', movie.movie1_12);

app.get('/book', book.index);
app.get('/book/book1', ensureAuthenticated, book.book1);

app.get('/music', music.index);
app.get('/music/music2', music.music2);
app.get('/music/music9', music.music9);
app.get('/music/music10', music.music10);
app.get('/music/music11', music.music11);

app.get('/news', news.index);
app.get('/news/news1', news.news1);
app.get('/news/news1_1', news.news1_1);
app.get('/news/news2', news.news2);
app.get('/news/news3', news.news3);
app.get('/news/news4', news.news4);
app.get('/news/news5', news.news5);
app.get('/news/news5_1', news.news5_1);



app.get('/perform', perform.index);

app.get('/rent', rent.index);
app.get('/rent/rent1', rent.rent1);
app.get('/rent/rent2', rent.rent2);
app.get('/rent/rent3', rent.rent3);


app.get('/salemedi', salemedi.index);

app.get('/salemedi/salemedi1', salemedi.salemedi1);
app.get('/salemedi/salemedi1_1', salemedi.salemedi1_1);
app.get('/salemedi/salemedi1_2', salemedi.salemedi1_2);
app.get('/salemedi/salemedi1_3', salemedi.salemedi1_3);
app.get('/salemedi/salemedi1_4', salemedi.salemedi1_4);
app.get('/salemedi/salemedi1_5', salemedi.salemedi1_5);


app.get('/salemedi/salemedi2', salemedi.salemedi2);
app.get('/salemedi/salemedi3', salemedi.salemedi3);
app.get('/salemedi/salemedi4', salemedi.salemedi4);
app.get('/salemedi/salemedi5', salemedi.salemedi5);
app.get('/salemedi/salemedi6', salemedi.salemedi6);
app.get('/salemedi/salemedi7', salemedi.salemedi7);
app.get('/salemedi/salemedi8', salemedi.salemedi8);
app.get('/salemedi/salemedi9', salemedi.salemedi9);
app.get('/salemedi/salemedi10', salemedi.salemedi10);
app.get('/salemedi/salemedi11', salemedi.salemedi11);
app.get('/salemedi/salemedi12', salemedi.salemedi12);


app.get('/sim', sim.index);


app.get('/hanryu', hanryu.index);
app.get('/hanryu/hanryu1', hanryu.hanryu1);
app.get('/hanryu/hanryu2', hanryu.hanryu2);
app.get('/hanryu/hanryu3', hanryu.hanryu3);
app.get('/hanryu/hanryu4', hanryu.hanryu4);
app.get('/hanryu/hanryu5', hanryu.hanryu5);


app.get('/3rdpot', rdpot.index);


app.get('/gpsbyname/:gpsName', ensureAuthenticated, gpsroute.gpsbyname);
app.get('/customer/gpsRoute', ensureAuthenticated, gpsroute.index);
app.get('/gpsbysex/:sex/:duration/:age', ensureAuthenticated, gpsroute.gpsbysex);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  else res.redirect('/auth/join');
  //return next();
}

function ensureAuthenticatedCustomer(req, res, next) {
  console.log(req.method);
  if (req.isAuthenticated()) { 
  var query = User.findOne({email:req.session.email});
  query.exec(function(err,user){
        if (err) throw err;
        else {
            if(user.userType=='Customer')
                return next(); 
            else res.redirect('/auth/join');
       }
    });
          
  
  }else{
    res.redirect('/auth/join');
  }
  
}


function ensureAuthenticatedAdmin(req, res, next) {
  console.log(req.method);
  if (req.isAuthenticated()) { 
  var query = User.findOne({email:req.session.email});
	query.exec(function(err,user){
        if (err) throw err;
        else {
            if(user.userType=='Admin')
                return next(); 
            else res.redirect('/auth/join');
       }
    });
          
  
  }else{
    res.redirect('/auth/join');
  }
  
}

function ensureAuthenticatedMerchant(req, res, next) {
  console.log(req.method);
  if (req.isAuthenticated()) { 
  var query = User.findOne({email:req.session.email});
	query.exec(function(err,user){
        if (err) throw err;
        else {
            if(user.userType=='Merchant')
                return next(); 
            else res.redirect('/auth/join');
       }
    });
          
  
  }else{
    res.redirect('/auth/join');
  }
  
}

