
var siteName = 'Heavy-lifting'
var heavyliftingModel      = require('../models/heavylifting.js');

exports.index = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
     	userid = req.user.id
		switch (true){
			case(userid == '586b5bbe935a6d19040c5447' || userid == '5878b000d1f7c0220c1d2903'):
//get the forth element id in the database
heavyliftingModel.find().exec(function (err, forms) {
  if (err) { return next(err); }
  if (forms.length<14) {
                res.render('init', {
                  title: 'Initialize',
                  siteName : siteName,
                  layout: false,
                  records : JSON.stringify(forms)
                });
  } else {
  	res.redirect('/admin');
  }
                });
			break;
			default:
				res.redirect('/dashboard');
			break;
			}
       } else {
         res.render('home', {
			title: 'Home',
			siteName : siteName,
			layout: false,
		});
       }
};
