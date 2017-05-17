var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'

/////////////////////////////
/////     COMPONENTS    ///// 
/////////////////////////////
exports.components = function(req, res) {
//Perform Routing for Varios user type on the home page.
 
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58d371b01373c63dccdee169'
    var Formids = init[3]._id
    res.render('components', {
      siteName : siteName,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
  });
 
};
 

////////////////////////
/////     HELP    ///// 
//////////////////////
exports.help = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
 userid = req.user.id
 switch (true){
  default:
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58ddf0747d12ca2fc4ef88cb'
    var Formids = init[3]._id
    res.render('help', {
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

////////////////////////
/////     HELP    ///// 
//////////////////////
exports.forms = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
 userid = req.user.id
 switch (true){
  default:
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58df3fdc48e76c2c1894d704'
    var Formids = init[3]._id
    res.render('forms', {
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

/////////////////////////
/////     STORE    ///// 
///////////////////////
exports.store = function(req, res) {
//Which id data to use.
var ids = '58d222d18d9bfd28846eb792'
   heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58d222d18d9bfd28846eb792'
    var Formids = init[3]._id
    res.render('store', {
      siteName : siteName,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
  });
}; 

/////////////////////////
/////  DATABASE    ///// 
///////////////////////
exports.database = function(req, res) {


  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58d2010b118e812d18654119'
    var Formids = init[3]._id
    res.render('database', {
      siteName : siteName,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
  });

}; 

/////////////////////////////////
/////  NEW ORGINIZATION    ///// 
///////////////////////////////
exports.neworg = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
 userid = req.user.id
 switch (true){
  default:
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58d2010b118e812d18654119'
    var Formids = init[3]._id
    res.render('neworg', {
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

//////////////////////////////////
/////  PRIVACY STATEMENT    ///// 
////////////////////////////////
exports.privacy = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
 userid = req.user.id
 switch (true){
  default:
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58ddf10c7d12ca2fc4ef88cf'
    var Formids = init[3]._id
    res.render('templates', {
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

//////////////////////////////////
/////  TERMS STATEMENT    ///// 
////////////////////////////////
exports.terms = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
 userid = req.user.id
 switch (true){
  default:
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = '58ddf0b77d12ca2fc4ef88cc'
    var Formids = init[3]._id
    res.render('templates', {
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


////////////////////
/////  SITE    ///// 
///////////////////
exports.assemblies = function(req, res) {
var ids = '58f99a2b11db6c2118a9fa2a'
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
    res.render('assemblies', {
      siteName : siteName,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(ids)
    });
})
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
    res.render('configuration', {
      siteName : siteName,
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
    res.render('reports', {
      siteName : siteName,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(ids)
    });
})
}; 