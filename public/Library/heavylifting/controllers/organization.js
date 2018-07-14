var organizationalModel      = require('../../../node_modules/fraternate/models/organizations.js');
var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var app = express();

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
//Middelware -  Limit to 1 query.


////////////////////////////////////
////////// PROFILE PAGE ////////////
///////////////////////////////////
exports.userorganizations = function(req, res, next) {
  //Work around for the home controller with out paramater request
  if (req.user) { 
    if (!req.params.username) { 
    req.params.username = req.user.username
    }
  }
  var query1 = organizationalModel.find(
    {$or: [
      {"entry.members": req.params.username },
      {"entry.owner":  req.params.username }
      ]}
      )
  query1.exec(function (err, query1_return) {
    if(err){console.log('Error Here'); return;} 
    //console.log(query1_return,'query1_return userorganizations')
    req.organizations = query1_return
    req.organizationsParse = JSON.stringify(query1_return)
    next();
       //Query end
     })
};

////////////////////////////////////////////////
////////// ORGANIZATION PERMISSION ////////////
//////////////////////////////////////////////
exports.organizationpermission = function(req, res, next) {
  //Work around for the home controller with out paramater request
  if (req.user) { 
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, organization) {
      if (organization.entry.owner == req.user.username) {
        req.orgowner = true 
      }
      for (var i = 0; i < organization.entry.members.length; i++) {
        if (organization.entry.members[i] == req.user.username) {
          req.orgmember = true 
        }
      }
    next();
    })
  } else {
    next();
  }
};  