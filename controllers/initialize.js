var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'


//open the page
exports.init = function(req, res) {
  //Perform Routing for Varios user type on the home page.
  if (req.user) {
//get the forth element id in the database
heavyliftingModel.find().exec(function (err, forms) {
  if (err) { return next(err); }
           userid = req.user.id
                res.render('init', {
                  title: 'Initialize',
                  siteName : siteName,
                  layout: false,
                  records : JSON.stringify(forms)
                });
                });
  } else {
   res.redirect('/');
  }
};

//open the page
exports.deletedb = function(req, res) {
  //Perform Routing for Varios user type on the home page.
  if (req.user) {
  //get the forth element id in the database
  heavyliftingModel.collection.drop();
  } else {
   res.redirect('/');
  }
};

//open the page
exports.getdb = function(req, res) {
  //Perform Routing for Varios user type on the home page.
  var userid = req.user.id
     if (userid == '586b5bbe935a6d19040c5447' | userid == '5878b000d1f7c0220c1d2903') {
//get the forth element id in the database
heavyliftingModel.find().exec(function (err, forms) {
  if (err) { return next(err); }
                res.send(JSON.stringify(forms));
                });
  } else {
   res.redirect('/');
  }
};