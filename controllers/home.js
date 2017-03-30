
var siteName = 'Heavy-lifting'
var heavyliftingModel      = require('../models/heavylifting.js');

exports.index = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {

 

var ids = '58d2115cd9c22811c4df3a08'
    heavyliftingModel.find({
      'entry.parent' : ids,
      'active' : 'true'
    }).exec(function (err, navmenu) {
    if (err) { return next(err); }      
    console.log('//////////////////////////////////')
    console.log('//////// DEBUG NAVMENU //////////')
    console.log('////////////////////////////////')      
 
    res.render('splash', {
 
      nav : JSON.stringify(navmenu),
      layout: false
    });

  });

 

    } else {
    res.render('home', {
      title: 'Home',
      siteName : siteName,
      layout: false
    });
    }
};
