var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'


exports.settings = function(req, res) {
  //Perform Routing for Varios user type on the home page.
  if (req.user) {
           userid = req.user.id
                res.render('settings', {
                  title: 'settings',
                  siteName : siteName,
                  layout: false,
                });
  } else {
   res.redirect('/');
  }
};
 