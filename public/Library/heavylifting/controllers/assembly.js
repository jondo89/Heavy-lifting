//var assembliesModel      = require('../models/assemblies.js');
//var formsModel      = require('../../../plugins/semini/models/forms.js');
var ObjectId = require('mongodb').ObjectID;
var directory =  '../'
///////////////////////////////////////////////
////     SET YOUR APP.JSON DETAILS        //// 
/////////////////////////////////////////////
//Not working ? try double dots on the json url..
var myModule = require('../../../app.json');
var sitename = myModule.sitename
var website = myModule.website
var repo = myModule.repo

/////////////////////////////////
////       DEBUGGING        //// 
///////////////////////////////
var debugMode = true
function debugging(req,query){
  if (query) {
    console.log()
    console.log('----------  DEBUGGING  ----------')
    console.log('Directory Name : '+__dirname)
    console.log('Original req URL : '+req.originalUrl)
    console.log('----------  DEBUGGING  ----------')
    console.log()
  }
}

//////////////////////////////////////////////////////
////       DEPLOY THE REQUESTED TEMPLATE         //// 
////////////////////////////////////////////////////
exports.newassy = function(req, res) {
   res.render(directory+'/views/newassy')
}

////////////////////
/////  SITE    ///// 
///////////////////
exports.assemblies = function(req, res) {
if (req.user) {
  formsModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '59e83513e0f9501550e9cf80'
    var Formids = init[3]._id
    res.render(directory+'/views/assemblies', {
      pagetitle: 'Assemblies | '+sitename ,
      siteName : sitename,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(ids)
    });
  });
} else {
 res.redirect('/signin');
}
}; 



 