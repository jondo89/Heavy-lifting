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

