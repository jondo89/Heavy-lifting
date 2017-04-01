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
//Perform Routing for Varios user type on the home page.
if (req.user) {
 userid = req.user.id
 switch (true){
  default:
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
  break;
}
} else {
 res.redirect('/signin');
}
}; 

/////////////////////////
/////  DATABASE    ///// 
///////////////////////
exports.database = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
 userid = req.user.id
 switch (true){
  default:
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
  break;
}
} else {
 res.redirect('/signin');
}
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