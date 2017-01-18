var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;
/////////////////////////////////////////
////    PERMANENT DELETE ENTRY      //// 
///////////////////////////////////////
exports.deleteentry = function(req, res) {
  heavyliftingModel.
  remove({
    _id : req.param('idItem'),
  }).
  exec(function (err, docs) {
    if (err) { return next(err); } 
    res.redirect('/admin');
  });
}