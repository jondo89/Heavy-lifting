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
var childitem=''
//////////////////////////////
//  1.RETURN CURRENT ITEM  //
////////////////////////////
//Query to find the menu item selected.
var query = heavyliftingModel.findOne(
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
  if (err) { return next(err); } 
if (query_return.childType) {
 childitem=query_return.childType 
} 
///////////////////////////
// 2.RETURN CHILD ITEM  //
/////////////////////////
var query1 = heavyliftingModel.find(
{
  $and : 
  [
  {$or: [
    {"elementID": childitem },
    {"_id":  childitem }
    ]}, 
    {
      "active": "true" 
    }
    ]
  })
////////////////////////////////////////////////////////////////////
// 3.RETURN THE ASSOCIATED FORM ELMENTS OF THE ABOVE CHILD ITEM  //
//////////////////////////////////////////////////////////////////
var query2 = heavyliftingModel.find(
{
  $and : 
  [
  {
    "parentid": childitem 
  }, 
  {
    "active": "true" 
  }
  ]
})
///////////////////////////////////////
//  4.ENTRIES CREATED BY THIS FORM  //
/////////////////////////////////////
var query3 = heavyliftingModel.find(
{
  $and : 
  [
  {
    "parentid": ids 
  }, 
  {
    "active": "true" 
  }
  ]
})

///////////////////////////////////////
//  5.LEGACY ITEM FOR PRIMER FORMS  //
/////////////////////////////////////
var query4 = heavyliftingModel.find(
{
    'entry.parent' : childitem,
    'active' : 'true'
})



query1.exec(function (err, query1_return) {
  if (err) { return next(err); } 




    //undefined error handling on the template
    if (!query1_return[0].entry.template){
      query1_return[0].entry.template=''
    }
    switch (true){
      case (query1_return[0].entry.template !== ''):
      var template = query1_return[0].entry.template
      if (query1_return[0].entry.template == 'viewall') {
        query4 = heavyliftingModel.find(
        {
          "active": "true" 
        })
      }
      break;
      default:
      var template = 'databasetablelist' 
      break;
    }
    //the menu item elementid should arrive poulated to avoid confusion.
    if(query1_return[0].elementID==''){
      query1_return[0].elementID=query1_return[0]._id
    }



query2.exec(function (err, query2_return) {
  if (err) { return next(err); } 
  query3.exec(function (err, query3_return) {
  if (err) { return next(err); } 



  query4.exec(function (err, query4_return) {
  if (err) { return next(err); } 



for (var i = 0; i < query1_return.length; i++) {
      //the menu item elementid should arrive poulated to avoid confusion.
    if(query1_return[i].elementID==''){
      query1_return[i].elementID=query1_return[i]._id
    }
}

for (var i = 0; i < query2_return.length; i++) {
      //the menu item elementid should arrive poulated to avoid confusion.
    if(query2_return[i].elementID==''){
      query2_return[i].elementID=query2_return[i]._id
    }
}

for (var i = 0; i < query3_return.length; i++) {
      //the menu item elementid should arrive poulated to avoid confusion.
    if(query3_return[i].elementID==''){
      query3_return[i].elementID=query3_return[i]._id
    }
}


console.log('//  Debug from here  //')
console.log('query_return',query_return)
console.log('query1_return',query1_return)
console.log('query2_return',query2_return)
console.log('query3_return',query3_return)
console.log('query4_return',query4_return)
console.log('ids',ids)
console.log('childitem',childitem)
console.log('//  Debug from here  //')

          res.render('store', {
            query  :  JSON.stringify(query_return),
            query1 :  JSON.stringify(query1_return),
            query2 :  JSON.stringify(query2_return),
            query3 :  JSON.stringify(query3_return),
            query4 :  JSON.stringify(query4_return),
            templateload : JSON.stringify(ids),
           
       //     databaseitems : JSON.stringify(databaseitems),
          //  menuitem : JSON.stringify(menuitem[0]),
         //   raw : JSON.stringify(menuitem[0].entry.layout),
 
          });
//Query end
})
//Query end
})
//Query end
})
//Query end
})
//Query end
})

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

////////////////////
/////  SITE    ///// 
///////////////////
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