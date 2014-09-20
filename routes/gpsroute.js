var GPS = require('../models/gps');

exports.index = function(req, res){
  res.render('gpsroute/index', { title: '3rdpot', isAuthenticated: req.isAuthenticated() });
};


exports.gpsbyname = function(req, res){
       
        console.log(req.params.gpsName);
        var gpsName = req.params.gpsName;
        var query = GPS.findOne({'name': gpsName});
        
        query.exec(function(err,gps){
                console.log(gps);
                res.json(gps);    
         });
        
    
};
exports.gpsbysex = function(req, res){
       
        var sex = req.params.sex;
        var duration = req.params.duration;
        var age = req.params.age;
        console.log("sex : " +sex + " d : " + duration + " age : " + age);
    	var query = GPS.find({});
        
		query.exec(function(err,gps){
                //console.log(gps);
                var array = [];
                gps.forEach(function(obj){
                    if(obj.sex == sex || obj.sex == 'both'){
                        if(obj.age == age || obj.age == 'all'){
                            if(obj.duration == duration){
                                array.push(obj);    
                            }
                        }
                    }
                    
                });
                console.log(array.length);
                res.json(JSON.stringify(array));    
         });
	
    
};