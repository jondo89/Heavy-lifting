var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'
var User = require('../models/User');

 ////////////////////////////////////
////////// SETTINGS PAGE ///////////
///////////////////////////////////
exports.settings = function(req, res) {
  if (req.user) {
   userid = req.user.id
   switch (true){
    default:
    heavyliftingModel.find().limit(5).exec(function (err, init) {
      if (err) { return next(err); }
      var ids = '58db2e4f6c196145e853955e'
      var Formids = init[3]._id
      res.render('settings', {
        siteName : siteName,
        items : JSON.stringify(ids),
        Formids : JSON.stringify(Formids)
      });
    });
    break;
  }
} else {
 res.redirect('/signin');
}
};

////////////////////////////////////
////////// PROFILE PAGE ////////////
///////////////////////////////////
exports.profile = function(req, res) {
 //There is a requirement to limit the form size  , as such send the find and send the headings from the parent.
 var query1 = User.findOne(
 {
  "username" : req.params.username
})
 query1.exec(function (err, user) { 
  if(err){console.log('Error Here query1'); return;}
  if (user) {
    var query2 = heavyliftingModel.find(
    {
      userID : user._id
    },
    { created: 1  ,_id:0}
    )
    query2.exec(function (err, calender) { 
      if(err){console.log('Error Here query2'); return;}
      user.password = 'Kwakwakwa'
      res.render('account/profile', {
        userload : user,
        calender : calender
      });
       //Query end
     })
  } else {
   res.redirect('/');
 }
 //Query end
})
};