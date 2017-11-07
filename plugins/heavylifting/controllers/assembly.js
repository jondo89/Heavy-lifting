var heavyliftingModel      = require('../models/heavylifting.js');
var ObjectId = require('mongodb').ObjectID;

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
   res.render('../../../plugins/heavylifting/views/newassy')
}