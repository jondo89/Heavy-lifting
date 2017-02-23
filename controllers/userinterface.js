var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'


 ////////////////////////////////////
////////// SETTINGS PAGE ///////////
///////////////////////////////////
exports.settings = function(req, res) {
          res.render('settings', {
			title: 'Settings',
			siteName : siteName,
			layout: false,
		});
};

 
exports.settings = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
 userid = req.user.id
  heavyliftingModel.find().limit(50).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = init[36]._id
    var Formids = init[3]._id
          res.render('settings', {
			title: 'Settings',
      siteName : siteName,
      layout: false,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
  });
} else {
 res.redirect('/signin');
}
};