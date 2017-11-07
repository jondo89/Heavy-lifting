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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Page Controllers - rebuild


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Middelware -  Limit to 1 query.


////////////////////////////////////////////////////
////       POULATE THE CONTRIBUTION GRAPH      //// 
///////////////////////////////////////////////////
exports.heavyliftingalluser = function(req, res, next) {
  debugging(req,debugMode)
//verify the string query.
if (req.user) {
  var query1 = heavyliftingModel.find(
  {
    "userID": req.user.id}
    )
  query1.exec(function (err, query1_return) {
    if(err){console.log('Error Here'); return;} 
//autopoulate the elementID
if(query1_return){
  for (var i = 0; i < query1_return.length; i++) {
        //the menu item elementid should arrive poulated to avoid confusion.
        if(query1_return[i].elementID==''){
          query1_return[i].elementID=query1_return[i]._id
        }
      }
    } else {
      console.log('query1_return failed')
    } 
    req.items = query1_return
    req.itemsParse = JSON.stringify(query1_return)
    next();
  })
} else {
  console.log('entering and ',req.params.userid)
  var query1 = heavyliftingModel.find(
  {
    "userID": req.params.userid}
    )
  query1.exec(function (err, query1_return) {
    if(err){console.log('Error Here'); return;} 
//autopoulate the elementID
if(query1_return){
  for (var i = 0; i < query1_return.length; i++) {
        //the menu item elementid should arrive poulated to avoid confusion.
        if(query1_return[i].elementID==''){
          query1_return[i].elementID=query1_return[i]._id
        }
      }
    } else {
      console.log('query1_return failed')
    } 
    req.items = query1_return
    req.itemsParse = JSON.stringify(query1_return)
    next();
  })
}
}

////////////////////////////////////////////////////////////
////////// PROFILE PAGE - AJAX IN USER DETAILS ////////////
//////////////////////////////////////////////////////////
exports.getuserdetails = function(req, res) {
  console.log('----------------------------------')
  console.log('----------------------------------')
  console.log('----------------------------------')
  console.log('----------------------------------')
  if (req.user) {
    res.send(
    {
      organizations : req.organizations,
      organizationsParse:req.organizationsParse,
      userorgcomplist:req.userorgcomplist,
      userorgcomplistParse:req.userorgcomplistParse,
      componentlist : req.componentlist,
      componentlistParse : req.componentlistParse,
      componentlistall : req.componentlistall,
      componentlistParseall : req.componentlistParseall,
    items:req.items, //list of all heavy-lifting DB entires
    itemsParse:req.itemsParse,//list of all heavy-lifting DB entires
  }
  )
  } else {
    res.send(
    {
      organizations : req.organizations,
      organizationsParse:req.organizationsParse,
      userorgcomplist:req.userorgcomplist,
      userorgcomplistParse:req.userorgcomplistParse,
      componentlist : req.componentlist,
      componentlistParse : req.componentlistParse,
      componentlistall : req.componentlistall,
      componentlistParseall : req.componentlistParseall,
    items:req.items, //list of all heavy-lifting DB entires
    itemsParse:req.itemsParse,//list of all heavy-lifting DB entires
  }
  )
  }
};
