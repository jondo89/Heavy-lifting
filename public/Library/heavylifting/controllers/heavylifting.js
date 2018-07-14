
 

//var heavyliftingModel      = require('../models/heavylifting.js');
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
  var query1 = res.locals.models[res.locals.collections[res.locals.routeSet]['collectionName']].find(
  {
    "userID": req.user.id}
    ).sort({_id:-1}).limit( 1500 )
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
  //console.log('entering and ',req.params.userid)
  var query1 = res.locals.models[res.locals.collections[res.locals.routeSet]['collectionName']].find(
  {
    "userID": req.params.userid}
    ).sort({_id:-1}).limit( 1500 )
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



////////////////////////////////////
////////// SETTINGS PAGE ///////////
///////////////////////////////////
exports.settings = function(req, res) {
  if (req.user) {
   userid = req.user.id
   switch (true){
    default:
    res.locals.models[res.locals.collections[res.locals.routeSet]['collectionName']].find().limit(5).exec(function (err, init) {
      if (err) { return next(err); }
      var ids = '58db2e4f6c196145e853955e'
      var Formids = init[3]._id
      res.render('settings', {
        siteName : sitename,
        items : JSON.stringify(ids),
        Formids : JSON.stringify(Formids),
        pagetitle: 'Setttings | '+sitename+'',
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
    var query2 = res.locals.models[res.locals.collections[res.locals.routeSet]['collectionName']].find(
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
        calender : calender,
        organizations : req.organizations,
        organizationsParse:req.organizationsParse,
        userorgcomplist:req.userorgcomplist,
        userorgcomplistParse:req.userorgcomplistParse,
        componentlist : req.componentlist,
        componentlistParse : req.componentlistParse,
        componentlistall : req.componentlistall,
        componentlistParseall : req.componentlistParseall,
        items:req.items, //list of all '+sitename+' DB entires
        itemsParse:req.itemsParse,//list of all '+sitename+' DB entires
        pagetitle: user.username+' | '+sitename+'',
      });
    })
  } else {
   res.redirect('/');
 }
 //Query end
})
};

//////////////////////////////
//////////  PAGE ////////////
////////////////////////////
exports.page = function(req, res) {
  if (req.user) {
    var template =  req.params.page 
    var username =  req.params.username 

    switch (true){
      case(template=='organizations'):
      var query1 = organizationalModel.find(
        {$or: [
          {"entry.members": username },
          {"entry.owner":  username }
          ]}
          )
      query1.exec(function (err, query1_return) {
        if(err){console.log('Error Here'); return;} 
        res.render('settings/'+template,{
          organizations : query1_return,
          organizations : req.organizations,
          organizationsParse:req.organizationsParse,
          userorgcomplist:req.userorgcomplist,
          userorgcomplistParse:req.userorgcomplistParse,
          componentlist : req.componentlist,
          componentlistParse : req.componentlistParse,
          componentlistall : req.componentlistall,
          componentlistParseall : req.componentlistParseall,
          pagetitle: template+' | '+sitename+'',
        });
      //Query end
    })
      break;
      case(template=='components'):
      var query1 = organizationalModel.find(
        {$or: [
          {"entry.members": username },
          {"entry.owner":  username }
          ]}
          )
      query1.exec(function (err, query1_return) {
        if(err){console.log('Error Here'); return;} 
        res.render('settings/'+template,{
          organizationsParse:req.organizationsParse,
          userorgcomplist:req.userorgcomplist,
          userorgcomplistParse:req.userorgcomplistParse,
          componentlist : req.componentlist,
          componentlistParse : req.componentlistParse,
          componentlistall : req.componentlistall,
          componentlistParseall : req.componentlistParseall,
          pagetitle: template+' | '+sitename+'',
        });
      //Query end
    })
      break;
      default:
      res.render('settings/'+template,{
        //issueparent : req.issueparent,
      });
      break;
    }
  } else {
   res.redirect('/signin');
 }
};

//////////////////////////////
//////////  USERS ////////////
////////////////////////////
exports.users = function(req, res) {
  if (req.user) {
    if (req.user.permission=="superadmin") {
      User.find(  function(err, username) {
        res.render('userlist',{
          username : username,
          pagetitle: 'Users | '+sitename+'',
        });
      });
    } else {
     res.redirect('/signin');
   }  
 } else {
   res.redirect('/signin');
 }
};

////////////////////////////////
//////////  SEARCH ////////////
//////////////////////////////
exports.usersearch = function(req, res) {
  var myExp = new RegExp(req.param('item'), 'i');
  var query1 = User.find({"username" : {$regex : myExp}})
  query1.exec(function (err, query1_return) {
    if(err){
      res.send("No user found");
      return;} 
         //console.log(query1_return)
         res.send(
          { users : query1_return}
          );
       })
};

 

//////////////////////////////////
/////  PRIVACY STATEMENT    ///// 
////////////////////////////////
exports.privacy = function(req, res) {
res.render('privacy-statement',{
      pagetitle: 'Privacy | '+sitename+'',
})
}; 

//////////////////////////////////
/////  TERMS STATEMENT    ///// 
////////////////////////////////
exports.terms = function(req, res) {
res.render('terms-of-service',{
      pagetitle: 'Terms of Service | '+sitename+'',
})
}; 



 