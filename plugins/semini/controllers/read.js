var formsModel      = require('../models/forms.js');
var ObjectId = require('mongodb').ObjectID;
var directory = '../../../plugins/semini/views/'

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

///////////////////////////////////
////  GET THE PRIMER FORM     //// 
/////////////////////////////////
exports.getprimer = function(req, res) {
  debugging(req,debugMode)
//Error trap and handling of form calls , all calls are based on Which form , using what data , any by editing self , editing raw or creating new.
//Which id form to use.
var formdata = req.query.formdata
if (!formdata) {
  formdata =''
}
//Special heading for this form
var headings = req.query.headings
if (!headings) {
  headings =''
}
//Which id data to use.
var idItem = req.query.idItem
if (!idItem) {
  idItem =''
}
//Edit Self / Edit Raw or create new.
var raw = req.query.raw
if (!raw) {
  raw ='false'
}
//used for the database items which require a location from which the data was created.
var parentid = req.query.parentid
if (!parentid || parentid=='') {
  parentid ='false'
}
//used for the database items which require a location from which the data was created.
var entry = req.query.entry
if (!entry) {
  entry =''
}
  //Determine how many forms exist on the server.
  var query1 = formsModel.find().limit(1)
  query1.exec(function (err, results) {
    if(err){console.log('Error Here'); return;}
    formdata = results[0]._id
    res.render(directory+'form', {
      title: 'Form',
      formdata : JSON.stringify(formdata),
      idItem : JSON.stringify(idItem),
      parentid : JSON.stringify(parentid),
      headings : headings,
      raw :JSON.stringify('use') ,
      parentItem : JSON.stringify(results[0]) ,
      entry : entry, 
      additionaldetails : req.additionaldetails ,
      layout: false,
    });
  })
}

////////////////////////////////
////  GET THE RAW FORM     //// 
//////////////////////////////
exports.getraw = function(req, res) {
  debugging(req,debugMode)
//Error trap and handling of form calls , all calls are based on Which form , using what data , any by editing self , editing raw or creating new.
//Which id form to use.
var formdata = req.query.formdata
if (!formdata) {
  formdata =''
}
//Special heading for this form
var headings = req.query.headings
if (!headings) {
  headings =''
}
//Which id data to use.
var idItem = req.query.idItem
if (!idItem) {
  idItem =''
}
//Edit Self / Edit Raw or create new.
var raw = req.query.raw
if (!raw) {
  raw ='false'
}
//used for the database items which require a location from which the data was created.
var parentid = req.query.parentid
if (!parentid || parentid=='') {
  parentid ='false'
}
//used for the database items which require a location from which the data was created.
var entry = req.query.entry
if (!entry) {
  entry =''
}
  //Determine how many forms exist on the server.
  var query1 = formsModel.find().limit(2)
  query1.exec(function (err, results) {
    if(err){console.log('Error Here'); return;}
    formdata = results[1]._id
    res.render(directory+'form', {
      title: 'Form',
      formdata : JSON.stringify(formdata),
      idItem : JSON.stringify(idItem),
      parentid : JSON.stringify(parentid),
      headings : headings,
      raw :JSON.stringify('raw') ,
      parentItem : JSON.stringify(results[1]) ,
      entry : entry, 
      additionaldetails : req.additionaldetails ,
      layout: false,
    });
  })
}


////////////////////////////////////////////////////
////       GET FORM AND DATA | ONLY FORM       //// 
//////////////////////////////////////////////////
exports.getdata = function(req, res) {
  //Debugging  
  debugging(req,debugMode)
//Which id form to use.
var formdata = req.query.formdata
if (!formdata) {
  formdata =''
}
//Which id data to use.
var idItem = req.query.idItem
if (!idItem ) {
  idItem = formdata
}
if (idItem =="undefined") {
  idItem = formdata
}
//Edit Self / Edit Raw or create new.
var raw = req.query.raw
if (!raw) {
  raw ='false'
}
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
console.log('-----------getdata------------')
console.log('formdata : ',JSON.stringify(formdata))
console.log('idItem : ',JSON.stringify(idItem))
console.log('raw :',JSON.stringify(raw))
console.log('formdata : ',formdata)
console.log('-----------getdata------------')

/////////////////////////////
////      DEBUG         //// 
///////////////////////////
var temp =""

var query = formsModel.find(
{
  $and : 
  [
  {$or: [
    {"elementID": formdata },
    {"_id":  formdata }
    ]}, 
    {
      "active": "true" 
    }
    ]
  })
var query1 = formsModel.find(
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
query.exec(function (err, docs1) {
  if(err){console.log('Error Here Query'); return;}
  query1.exec(function (err, docs2) {
    if(err){console.log('Error Here Query 1'); return;}
    var temp = docs2[0] 
      //if the entry id is blank then autopopulate the entry ID with the current ID.
      if (docs2[0]) {
        if (docs2[0].elementID == ''   ) {
          docs2[0].elementID = docs2[0]._id
          docs2[0].revision = 'updated'
        }
        if (docs2.length == 0) {
          temp=''
        }
      } else {
        console.log('-----------MISSING FORM DATA------------')
        console.log('No form childType has been defined , and as such no form will be able to load.')
        console.log('-----------MISSING FORM DATA------------')
      }

/////////////////////////////
////      DEBUG         //// 
///////////////////////////
//console.log('-----------getdata stage 2------------')
//console.log('formdata : ',docs1[0])
//console.log('idItem : ',temp)
//console.log('docs1 :',docs1[0].entry)
//console.log('docs2 :',docs2[0].entry)
//console.log('-----------getdata stage 2------------')
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
res.send({
  formdata : docs1[0] , 
  idItem : temp
});
})
})
}

//////////////////////////////////////////////
////       GET AND SEND JSTREE DATA      //// 
////////////////////////////////////////////
exports.jstree = function(req, res) {
  //Debugging  
  debugging(req,debugMode)
  var ids = req.query.ids

  var query = formsModel.find(
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
  var query1 = formsModel.find(
  {
    "active": "true" ,
    "parentid": ids,      
  })
  query.exec(function (err, docs) {
    if(err){console.log('Error Here'); return;} 
    query1.exec(function (err, docs1) {
      if(err){console.log('Error Here'); return;} 
      var temp ={
        thisitem : docs,
        children : docs1
      }
      console.log(ids)
      console.log(temp)
      res.send(JSON.stringify(temp))
    })
  })
}



//////////////////////////////////////////////////////
////       DEPLOY THE REQUESTED TEMPLATE         //// 
////////////////////////////////////////////////////
exports.templateload = function(req, res) {
  //Debugging  
  debugging(req,debugMode)

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
var query = formsModel.findOne(
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
 if(err){console.log('Error Here'); return;}
 if (query_return.childType) {
   childitem=query_return.childType 
 } else {
  childitem='58f8a43a6baa3a33ccff5299'
}
///////////////////////////
// 2.RETURN CHILD ITEM  //
/////////////////////////
var query1 = formsModel.find(
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
var query2 = formsModel.find(
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
var query3 = formsModel.find(
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
var query4 = formsModel.find(
{
  'entry.parent' : childitem,
  'active' : 'true'
})
///////////////////////////////
//  6.THE TEMPLATE TO LOAD  //
//////////////////////////////
var query5 = formsModel.findOne(
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

query1.exec(function (err, query1_return) {
  if(err){
    console.log('No Child item'); 
  } 

  query2.exec(function (err, query2_return) {
    if(err){
      console.log('No Child item'); 
    } 

    query3.exec(function (err, query3_return) {
      if(err){console.log('Error Here'); return;} 

      query4.exec(function (err, query4_return) {
        if(err){
          console.log('No Child item'); 
        } 
        
        query5.exec(function (err, query5_return) {
          if(err){

            var template= 'formtable'
          } 
          
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

  /*
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
  */

  if (query_return.entry.template) {
    template = query_return.entry.template
  } else {
    template = 'formtable' 
  }
  res.render(directory+template, {
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

///////////////////////////////////////////////////
////       SEND THE DATABASE INFORMATION      //// 
/////////////////////////////////////////////////
exports.templatename = function(req, res) {
  //Debugging  
  debugging(req,debugMode)
  var template = req.param('template') 
  res.render(directory+'/tools/'+template, {layout:false}, function(err, html) {
    if(err) {
      var html = ''
      res.send(html);
    } else {
      res.send(html);
    }
  });
}



///////////////////////////////////////////////////
////       DEPLOY THE HANDLEBARS FORM         //// 
/////////////////////////////////////////////////
exports.getform = function(req, res) {
  //Debugging  
  debugging(req,debugMode)
  if (req.user) {


//Error trap and handling of form calls , all calls are based on Which form , using what data , any by editing self , editing raw or creating new.
//Which id form to use.
var formdata = req.param('formdata')
if (!formdata) {
  formdata =''
}

//Special heading for this form
var headings = req.param('headings')
if (!headings) {
  headings =''
}

//Which id data to use.
var idItem = req.param('idItem')
if (!idItem) {
  idItem =''
}
//Edit Self / Edit Raw or create new.
var raw = req.param('raw')
if (!raw) {
  raw ='false'
}
//used for the database items which require a location from which the data was created.
var parentid = req.param('parentid')
if (!parentid || parentid=='') {
  parentid ='false'
}
//used for the database items which require a location from which the data was created.
var entry = req.param('entry')
if (!entry) {
  entry =''
}
//There is a requirement to limit the form size  , as such send the find and send the headings from the parent.
var query1 = formsModel.find(
{
  $and : 
  [
  {$or: [
    {"elementID": parentid },
    {"_id":  parentid }
    ]}, 
    {
      "active": "true" 
    }
    ]
  })

query1.exec(function (err, parentItem) {
  if(err){console.log('Error Here'); return;}
//This is used to pull the first 2 entries from the database. 
//will return the ids for the form data on the primer and raw database entry.
formsModel.find().limit(3).exec(function (err, forms) {
  if(err){console.log('Error Here'); return;}
  //The primer and Raw are the first 2 items in the database.
  //This does mean the that the forms are not being edited.
  switch(true){
    case(raw == 'edit'):
    formdata = forms[0]._id
    break;
    case(raw == 'raw' || raw == 'copyraw'):
    formdata = forms[1]._id
    break;
    case(raw == 'self'):
    formdata = forms[2]._id
    break;    
    case(forms.length == 1  ):
    formdata = forms[0]._id
    break;
    case(forms.length == 2  ):
    formdata = forms[1]._id
    break;
  }
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
 
console.log('-----------getform------------')
console.log('formdata : ',JSON.stringify(formdata))
console.log('idItem : ',JSON.stringify(idItem))
console.log('parentid :' ,JSON.stringify(parentid))
console.log('raw :',JSON.stringify(raw))
console.log('parentItem :',JSON.stringify(parentItem[0]))
console.log('headings :',headings)
console.log('entry :',entry)
console.log('-----------getform------------') 
/////////////////////////////
////      DEBUG         //// 
///////////////////////////

res.render(directory+'form', {
  title: 'Form',
  formdata : JSON.stringify(formdata),
  idItem : JSON.stringify(idItem),
  parentid : JSON.stringify(parentid),
  headings : headings,
  raw :JSON.stringify(raw) ,
  parentItem : JSON.stringify(parentItem[0]) ,
  entry : entry, 
  query2 : req.additionaldetailsParse ,
  layout: false,
});
});
});
} else {
  res.send('<div class="alert alert-danger" role="alert"><strong>On Snap!</strong> You have been logged out. <a href="/signin" >Sign in.</a></div>')
}

}


////////////////////////////////////////////////////
////       GET FORM AND DATA | ONLY FORM       //// 
//////////////////////////////////////////////////
exports.getdatacomp = function(req, res) {
  //Debugging  
  debugging(req,debugMode)
//Which id form to use.
var formdata = req.param('formdata')
if (!formdata) {
  formdata =''
}
//Which id data to use.
var idItem = req.param('idItem')
if (!idItem) {
  idItem =formdata
}
//Edit Self / Edit Raw or create new.
var raw = req.param('raw')
if (!raw) {
  raw ='false'
}

//Find the data to be viewed on the form.
var query1 = formsModel.find(
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
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
/*
console.log('-----------getdatacomp------------')
console.log('formdata : ',JSON.stringify(formdata))
console.log('idItem : ',JSON.stringify(idItem))
console.log('raw :',JSON.stringify(raw))
console.log('-----------getdatacomp------------')
*/
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
//find all of the parentid equal .
formsModel.find({
  'parentid' : formdata,
  'active' : 'true'
}).exec(function (err, form) {
  if(err){console.log('Error Here'); return;} 
  query1.exec(function (err, docs2) {
    if(err){console.log('Error Here'); return;}
    var temp = docs2[0] 
      //if the entry id is blank then autopopulate the entry ID with the current ID.
      if (docs2[0].elementID == '' ) {
        docs2[0].elementID = docs2[0]._id
        docs2[0].revision = 'updated'
      }
      if (docs2.length == 0) {
        temp=''
      }
      for (var i = 0; i < form.length; i++) {
      //the menu item elementid should arrive poulated to avoid confusion.
      if(form[i].elementID==''){
        form[i].elementID=form[i]._id
      }
    }
//turn into something that alpaca understands.
/*
console.log('-----------getdatacomp------------')
console.log('form : ',JSON.stringify(form))
console.log('-----------getdatacomp------------')
*/
res.send({
  formdata : form , 
  idItem : temp
});
})
})
}



//////////////////////////////////////////
///////////   READ  GROUPS  /////////////
////////////////////////////////////////
exports.groups = function(req, res) {
  //Debugging  
debugging(req,debugMode)
  formsModel.
  find({
    'entry.parent' :req.param('data'),
    'active' : 'true'
  }).
  exec(function (err, docs1) {
    if(err){console.log('Error Here'); return;}   


    if(docs1){
      for (var i = 0; i < docs1.length; i++) {
        //the menu item elementid should arrive poulated to avoid confusion.
        if(docs1[i].elementID==''){
          docs1[i].elementID=docs1[i]._id
        }
      }
    } else {
      console.log('docs1 failed')
    } 


/*
console.log('-----------groups------------')
console.log('docs1 : ',JSON.stringify(docs1))
console.log('-----------groups------------')
*/
res.send(JSON.stringify(docs1));
});
}