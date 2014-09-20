var Order = require('../models/order')
var User = require('../models/user')
var Utils = require('../libs/utils')
var paypal = require('paypal-rest-sdk');
var uuid = require('node-uuid');
var config = {};

exports.order = function(req, res){
	var qty = req.query.qty == null ? 1.00 : parseFloat(req.query.qty);
        var amount = req.query.amount == null ? 0.00 : parseFloat(req.query.amount); 
        var service = req.query.service == null ? 0.00 : parseFloat(req.query.service); 
        var total = (qty * amount) + service;
        var desc = req.query.desc;
        req.session.qty = qty;
        req.session.amount = amount;
        req.session.total = total;
        req.session.desc = desc;
        req.method = 'get';
        res.redirect('/orderconfirm');
}

exports.orderconfirm = function(req, res){
  res.render('paypal/orderconfirm', { title: '3rdpot', hasCreditCard: false, qty : req.session.qty, total: req.session.total, desc: req.session.desc });
};

exports.paypal = function(req, res){
	var order_id = uuid.v4();
    var paypalPayment = {
	        "intent": "sale",
	        "payer": {
	            "payment_method": "paypal"
	        },
	        "redirect_urls": {},
	        "transactions": [{
		        "amount": {
			        "currency": "USD",
                    "total": "0.00"
		        }
	        }]
            
	    };

        var url = "http://" + req.headers.host;
        var qty = req.session.qty;
        var amount = req.session.amount;
        var total = req.session.total;
        var desc = req.session.desc;

console.log(amount);
console.log(total);
console.log(desc);

	    paypalPayment.transactions[0].amount.total = parseInt(total);
	    paypalPayment.redirect_urls.return_url = url  + "/orderexecute?order_id=" + order_id;
	    paypalPayment.redirect_urls.cancel_url = url  + "/?status=cancel&order_id" + order_id;
	    paypalPayment.transactions[0].description = desc;
        console.log(JSON.stringify(paypalPayment));

	    paypal.payment.create(paypalPayment, {}, function (err, resp) {
            if (err) {
		        throw err;
		    }

			if (resp) {
				    var now = Utils.getKST();
                    
                    var newOrder = new Order();
					newOrder.orderId = order_id;
					newOrder.email = req.session.email;
                    newOrder.paymentId = resp.id;                                                                                                                            
					newOrder.state = resp.state;
					newOrder.amount = amount;
                    newOrder.qty = qty;
                    newOrder.amount = amount;
                    newOrder.total = total;
                    newOrder.desc = desc;
                    newOrder.orderDate = now;
                    
					newOrder.save(function(err){
						if(err) throw err;
						var link = resp.links;
						for (var i = 0; i < link.length; i++) {
							if (link[i].rel === 'approval_url') {
								res.redirect(link[i].href);
							}
						}
					
					})
			}
		});
	
}

exports.creditcard = function(req, res){
	var order_id = uuid.v4();
    var payment = {
	        "intent": "sale",
	        "payer": {
	            "payment_method": "credit_card",
	            "funding_instruments": [{
	                "credit_card_token": {}
	            }]
	        },
	        "transactions": [{
	            "amount": {
	                "currency": "USD"
	            },
	            "description": ""
	        }]
            
	    };
        
    
        var qty = req.session.qty;
        var amount = req.session.amount;
        var total = req.session.total;
        var desc = req.session.desc;

        var query = User.findOne({email:req.session.email});
	    query.exec(function(err,user){
        if(err) throw err;
	        payment.payer.funding_instruments[0].credit_card_token.credit_card_id = user.card;
		    payment.transactions[0].amount.total = total;
		    payment.transactions[0].description = desc;
		    paypal.payment.create(payment, {}, function (err, resp) {
			if (err) throw err;
		        
			if (resp) {
				    var now = Utils.getKST();
                    
                    var newOrder = new Order();
					newOrder.orderId = order_id;
					newOrder.email = req.session.email;
                    newOrder.paymentId = resp.id;                                                                                                                            
					newOrder.state = resp.state;
					newOrder.amount = amount;
                    newOrder.qty = qty;
                    newOrder.amount = amount;
                    newOrder.total = total;
                    newOrder.desc = desc;
                    newOrder.orderDate = now;

                    newOrder.paymentMethod = resp.payer.payment_method;
                    //newOrder.payerEmail = req.session.email;
                    console.log(resp.payer);
					newOrder.save(function(err){
						if(err) throw err;
						var link = resp.links;
						for (var i = 0; i < link.length; i++) {
							if (link[i].rel === 'approval_url') {
								res.redirect(link[i].href);
							}
						}
					})
                 
			}
		});

	   
    });
    
}

exports.orderexecute = function(req, res){
	var query = Order.findOne({orderId:req.query.order_id});
	query.exec(function(err,order){
        if (err) throw err;
        
        var payer = { payer_id : req.query.PayerID };
          
        paypal.payment.execute(order.paymentId, payer, {}, function (err, resp) {
            console.log(JSON.stringify(resp));
            if (err) throw err;

            if (resp) {
                
                var query = Order.findOne({orderId:req.query.order_id});
	            query.exec(function(err,order){
                    order.orderId = req.query.order_id;
                    order.state = resp.state;
                    order.create = resp.create_time;
                    order.paymentMethod = resp.payer.payment_method;
                    order.payerEmail = resp.payer.payer_info.email;
                    order.payerName = resp.payer.payer_info.first_name + " " + resp.payer.payer_info.last_name;
                    order.shippingAddress = resp.payer.payer_info.shipping_address.line1 + ", " 
                                            + resp.payer.payer_info.shipping_address.city + ", " 
                                            + resp.payer.payer_info.shipping_address.state + ", " 
                                            + resp.payer.payer_info.shipping_address.postal_code + ", " 
                                            + resp.payer.payer_info.shipping_address.country_code;
                    order.payerId = resp.payer.payer_id;
                    console.log(resp.payer);
                    order.save(function(err){
                        if(err) throw err;
                        res.redirect('/orders');
                    });

                });
                
            }
        });

    });
}

exports.profile = function(req, res){
  var query = User.findOne({email:req.session.email});
  query.exec(function(err,user){
       if(err) throw err;
       if(user){
       if(user.card){
           paypal.credit_card.get(user.card, {}, function (err, card) {
              if (err) throw err;
              res.render('auth/profile', { title: '3rdpot', isAuthenticated: req.isAuthenticated(), 'type' : card.type, 'number' : card.number, 'expire_month' : card.expire_month, 'expire_year' : card.expire_year, 'phone' : user.phone });
                //res.json({'type' : card.type, 'number' : card.number, 'expire_month' : card.expire_month, 'expire_year' : card.expire_year, 'phone' : user.phone});
            });
        }else {
          res.render('auth/profile', { title: '3rdpot', isAuthenticated: req.isAuthenticated(), 'type' : '', 'number' : '', 'expire_month' : '', 'expire_year' : '', 'phone' : '' });
        }
    }else res.redirect('/auth/join')
    });
  
};


exports.postprofile = function(req, res){
      var type = req.body.type;
    var number = req.body.number;
    var cvv2 = req.body.cvv2;
    var expire_month = req.body.expire_month;
    var expire_year = req.body.expire_year;
    var phone = req.body.phone;
    //var email = req.body.email;

    console.log(type + ' | ' + number + ' | ' + cvv2 + ' | ' + expire_month + ' | ' + expire_year + ' | ' + phone );

    if (type !== '' || number !== '') {
    card = {
                type: type, 
                number: number, 
                cvv2: cvv2, 
                expire_month: expire_month, 
                expire_year: expire_year 
                };
    paypal.credit_card.create(card, {}, function (err, card) {
      if (err) {
                     throw err;
      } else {
        console.log(card);
                var query = User.findOne({email:req.session.email});
              query.exec(function(err,user){
                    user.card = card.id;
                    user.phone = phone;
                    //user.card = card.id;
                    user.save(function(err){
                        if(err) throw err;
                        req.method='get';
                        res.redirect('/dashboard');
                    });

                });
                
      }
    });
  }    
}

exports.init = function (c) {
	config = c;
	paypal.configure(c.api);
};