var siteName = 'Heavy-lifting'
var heavyliftingModel      = require('../models/heavylifting.js');
var organizationalModel      = require('../models/organizations.js');

exports.index = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
  var query1 = organizationalModel.find(
    {$or: [
      {"entry.members": req.user.username },
      {"entry.owner":  req.user.username }
      ]}
      )
  query1.exec(function (err, query1_return) {
    if(err){console.log('Error Here'); return;} 
    res.render('splash', {
      organizations : query1_return,
      title: req.user.username + ' | Heavy-lifting' ,
    });
      //Query end
    })
} else {
  res.render('home', {
    title: 'Heavy-lifting',
    siteName : siteName,
    layout: false
  });
}
};
