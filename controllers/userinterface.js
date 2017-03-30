var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'


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
    res.render('database', {
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
if (req.user) {
 userid = req.user.id
 switch (true){
  default:
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58d9fa5797285841701acbdd'
    var Formids = init[3]._id
    res.render('account/profile', {
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