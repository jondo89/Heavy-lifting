var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;


//////////////////////////////////////////////////////
////       DEPLOY THE REQUESTED TEMPLATE         //// 
////////////////////////////////////////////////////
exports.productload = function(req, res) {
  console.log('//////////////////////////////////////////////////////////////////////////////')
  console.log('/////////////////////   PRODUCT LOAD                    //////////////////////')
  console.log('//////////////////////////////////////////////////////////////////////////////')
  console.log('This is starting',req.param('ids'))
//Which id data to use.
var ids = req.param('ids')
if (!ids) {
  ids =''
}
var template = req.param('template')
if (!template) {
  template =''
}
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
console.log('Debug 0.')
query.exec(function (err, query_return) {
     if(err){console.log('Error Here'); return;}
if (query_return.childType) {
 childitem=query_return.childType 
} else {
  childitem='58f8a43a6baa3a33ccff5299'
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
///////////////////////////////
//  6.THE TEMPLATE TO LOAD  //
//////////////////////////////
var query5 = heavyliftingModel.findOne(
{
  $and : 
  [
  {$or: [
    {"elementID": template },
    {"_id":  template }
    ]}, 
    {
      "active": "true" 
    }
    ]
  })
console.log('Debug 1.')
query1.exec(function (err, query1_return) {
  if(err){
    console.log('No Child item'); 
  } 
console.log('Debug 2.')
query2.exec(function (err, query2_return) {
  if(err){
    console.log('No Child item'); 
  } 
  console.log('Debug 3.')
  query3.exec(function (err, query3_return) {
  if(err){console.log('Error Here'); return;} 
console.log('Debug 4.')
  query4.exec(function (err, query4_return) {
  if(err){
    console.log('No Child item'); 
  } 
console.log('Debug 5.')
  query5.exec(function (err, query5_return) {
  if(err){
    console.log('No template id defined.'); 
    var template= 'databasetablelist'
  } 
console.log('Debug 6.')
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
if(query2_return){
for (var i = 0; i < query2_return.length; i++) {
      //the menu item elementid should arrive poulated to avoid confusion.
    if(query2_return[i].elementID==''){
      query2_return[i].elementID=query2_return[i]._id
    }
}
}else {
  console.log('query2_return failed')
}
if(query3_return){
for (var i = 0; i < query3_return.length; i++) {
      //the menu item elementid should arrive poulated to avoid confusion.
    if(query3_return[i].elementID==''){
      query3_return[i].elementID=query3_return[i]._id
    }
}
}else {
  console.log('query3_return failed')
}
if(query4_return){
for (var i = 0; i < query4_return.length; i++) {
      //the menu item elementid should arrive poulated to avoid confusion.
    if(query4_return[i].elementID==''){
      query4_return[i].elementID=query4_return[i]._id
    }
}
}else {
  console.log('query4_return failed')
}
console.log('//  Debug from here  //')
console.log('query_return',query_return)
console.log('query1_return',query1_return)
console.log('query2_return',query2_return)
console.log('query3_return',query3_return)
console.log('query4_return',query4_return)
console.log('query5_return',query5_return)
console.log('ids',ids)
console.log('childitem',childitem)
console.log('//  Debug from here  //')


if (query_return.entry.template) {
  template = query_return.entry.template
} else {
  template = 'databasetablelist' 
}
          res.render(template, {
            query  :  JSON.stringify(query_return),
            query1 :  JSON.stringify(query1_return),
            query2 :  JSON.stringify(query2_return),
            query3 :  JSON.stringify(query3_return),
            query4 :  JSON.stringify(query4_return),
            query5 :  JSON.stringify(query5_return),
            templateload : JSON.stringify(ids),
            layout:false,
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
//Query end
})
}