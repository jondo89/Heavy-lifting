var siteName = ''
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


/////////////////////////////
/////  LANDING PAGE    ///// 
///////////////////////////
exports.page = function(req, res) {
    console.log('')
    console.log('----------  PAGE LOADING  ----------')
    console.log(res.locals.collections[res.locals.routeSet]['pagetitle'] + ' | '+sitename)
    console.log('----------  PAGE LOADING  ----------') 
    console.log('')
    console.log(res.locals.pagedetail)
    res.render(res.locals.pagedetail.templatename, {
      route : res.locals.routeSet,
      templatename : res.locals.pagedetail.templatename ,
      description : res.locals.collections[res.locals.routeSet]['description'] ,
      siteName : sitename,
      pagetitle : res.locals.collections[res.locals.routeSet]['pagetitle'] + ' | '+sitename,
      title : res.locals.collections[res.locals.routeSet]['pagetitle'],
      items : JSON.stringify(res.locals.collections[res.locals.routeSet]['parentids']),
      Formids : JSON.stringify(res.locals.collections[res.locals.routeSet]['rawform']),
      issueparent : JSON.stringify(res.locals.collections[res.locals.routeSet]['issueparent'])
    });
}; 

/*
/////////////////////////////
/////     INTRODUCTION    ///// 
/////////////////////////////
exports.introduction = function(req, res) {
    res.render(directory+'/views/introduction', {
      pagetitle: 'Components | '+sitename ,
      siteName : sitename,
      title: 'Components | ',
    });
};

/////////////////////////////
/////     COMPONENTS    ///// 
/////////////////////////////
exports.components = function(req, res) {
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58d371b01373c63dccdee169'
    var Formids = init[3]._id
    res.render(directory+'/views/components', {
      pagetitle: 'Components | '+sitename ,
      siteName : sitename,
      title: 'Components | ',
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
  });
};
 
/////////////////////////////////
/////     DOCUMENTATION    ///// 
///////////////////////////////
exports.documentation = function(req, res) {
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58ddf0747d12ca2fc4ef88cb'
    var Formids = init[3]._id
    res.render(directory+'/views/documentation', {
      pagetitle: 'Documentation | '+sitename ,
      siteName : sitename,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
  });
};

////////////////////////
/////     FORMS   ///// 
//////////////////////
exports.forms = function(req, res) {
if (req.user) {
 userid = req.user.id
 switch (true){
  default:
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58df3fdc48e76c2c1894d704'
    var Formids = init[3]._id
    res.render(directory+'/views/forms', {
      pagetitle: 'Forms | '+sitename ,
      siteName : sitename,
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

/////////////////////////
/////     SHOP     ///// 
///////////////////////
exports.shop = function(req, res) {
var ids = '58d222d18d9bfd28846eb792'
   heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58d222d18d9bfd28846eb792'
    var Formids = init[3]._id
    res.render(directory+'/views/shop', {
      pagetitle: 'Shop | '+sitename ,
      siteName : sitename,
      title: 'Shop | ',
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
  });
}; 

/////////////////////////
/////  DATABASE    ///// 
///////////////////////
exports.database = function(req, res) {
//define page routing and details here
var heavyLiftingTemplate = directory+'/views/database'
var route = 'heavylifting'
var pagetitle = 'Database | '+sitename
var title = 'Database | '
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58d2010b118e812d18654119'
    var Formids = init[3]._id
    res.render(heavyLiftingTemplate, {
      route : route,
      heavyLiftingTemplate : heavyLiftingTemplate ,
      pagetitle: pagetitle ,
      siteName : sitename,
      title: title,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
  });
}; 

//////////////////////////////
/////  CONFIGURATION    ///// 
//////////////////////////////
exports.configuration = function(req, res) {
var ids = '58fc6a9b7a525938d01fbd68'
var query = heavyliftingModel.find(
{
  $and : 
  [
  {$or: [
    {"elementID": ids },
    {"_id":  ids }
    ]}, 
    {
      "active": "true" 
    }
    ]
  })
query.exec(function (err, query_return) {
  if(err){
        console.log('Error Here'); 
        res.send(JSON.stringify(['Data Loading Error - Server Error']));
  return;} 
    res.render(directory+'/views/configuration', {
      pagetitle: 'Configuration | '+sitename ,
      siteName : sitename,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(ids)
    });
})
}; 


////////////////////////
/////  REPORTS    ///// 
//////////////////////
exports.reports = function(req, res) {
var ids = '58ff286473c642469cf8f38c'
var query = heavyliftingModel.find(
{
  $and : 
  [
  {$or: [
    {"elementID": ids },
    {"_id":  ids }
    ]}, 
    {
      "active": "true" 
    }
    ]
  })
query.exec(function (err, query_return) {
  if(err){
        console.log('Error Here'); 
        res.send(JSON.stringify(['Data Loading Error - Server Error']));
  return;} 
    res.render(directory+'/views/reports', {
      pagetitle: 'Reports | '+sitename ,
      siteName : sitename,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(ids),
    });
})
}; 

*/