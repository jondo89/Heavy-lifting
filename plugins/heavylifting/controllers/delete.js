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

////////////////////////////////
////     DELETE ENTRY      //// 
//////////////////////////////
exports.deleteentry = function(req, res) {
var idItem = req.param('idItem')
if (!idItem) {
  idItem =''
}
console.log('-----------deleteentry------------')
console.log('idItem : ',idItem)
console.log('-----------deleteentry------------')
//User self check , admin and super admin.
//---------------------------------------------------------------------------------------------------------------------------
//Check for user.
if (req.user) {
	userid = req.user.id
	var query1 = heavyliftingModel.find(
	{
	  $and : 
	  [
	  {$or: [
	    {"elementID": idItem },
	    {"_id":  idItem }
	    ]}, 
	    {
	      "active": "true" 
	    }
	    ]
	  })
//find and review the document permissions.
	query1.exec(function (err, item) {
	  if (err) { return next(err); }
		//check if the user owns the file , or the user is admin or super admin.
		if (req.user.id == item[0].userID | req.user.permission == 'administrator' | req.user.permission == 'superadmin') {
//---------------------------------------------------------------------------------------------------------------------------
 heavyliftingModel.findOneAndUpdate({
	  $and : 
	  [
	  {$or: [
	    {"elementID": idItem },
	    {"_id":  idItem }
	    ]}, 
	    {
	      "active": "true" 
	    }
	    ]
	  }, 
	  {$set:{  active: 'false' , revision:'deleted' }}, {new: true}, function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    }
    res.send();
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		}  else {
			userid=''
			res.send({redirect: '/signin'});
		}
	})
}  else {
	userid=''
	res.send({redirect: '/signin'});
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}

/////////////////////////////////////////
////    PERMANENT DELETE ENTRY      //// 
///////////////////////////////////////
exports.deleteentryperm = function(req, res) {var idItem = req.param('idItem')
if (!idItem) {
  idItem =''
}
console.log('-----------deleteentryperm------------')
console.log('idItem : ',idItem)
console.log('-----------deleteentryperm------------')
//User self check , admin and super admin.
//---------------------------------------------------------------------------------------------------------------------------
//Check for user.
if (req.user) {
	userid = req.user.id
	var query1 = heavyliftingModel.find(
	{
	  $and : 
	  [
	  {$or: [
	    {"elementID": idItem },
	    {"_id":  idItem }
	    ]}, 
	    {
	      "active": "true" 
	    }
	    ]
	  })
//find and review the document permissions.
	query1.exec(function (err, item) {
	  if (err) { return next(err); }
		//check if the user owns the file , or the user is admin or super admin.
		if (req.user.id == item[0].userID | req.user.permission == 'administrator' | req.user.permission == 'superadmin') {
//---------------------------------------------------------------------------------------------------------------------------
 


  heavyliftingModel.findOneAndRemove({
	  $and : 
	  [
	  {$or: [
	    {"elementID": idItem },
	    {"_id":  idItem }
	    ]}, 
	    {
	      "active": "true" 
	    }
	    ]
	  }, function (err,offer){
    if(err){
        console.log("Something wrong when updating data!");
    }
    res.send();
  });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		}  else {
			userid=''
			res.send({redirect: '/signin'});
		}
	})
}  else {
	userid=''
	res.send({redirect: '/signin'});
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}