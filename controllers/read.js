var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;


exports.getCollectionData = function(req, res) {
  var types = req.param('objectType')
  var showall = req.param('showall')
  var userid
  if (req.user) {
   userid = req.user.id
 } else {
   userid=''
 }
 if (showall == 'true') {
  var query = heavyliftingModel.find(
  {
    "objectType": types ,    
  })
} else {
  var query = heavyliftingModel.find(
  {
    "active": "true" ,
    "objectType": types , 
  })
}
query.exec(function (err, docs1) {
  if(err){console.log('Error Here'); return;}
  res.send(JSON.stringify(docs1))
})
};

///////////////////////////////////////////////////
////       DEPLOY THE HANDLEBARS FORM         //// 
/////////////////////////////////////////////////
exports.getform = function(req, res) {
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
var query1 = heavyliftingModel.find(
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
heavyliftingModel.find().limit(3).exec(function (err, forms) {
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
res.render('form', {
  title: 'Form',
  siteName : siteName,
  formdata : JSON.stringify(formdata),
  idItem : JSON.stringify(idItem),
  parentid : JSON.stringify(parentid),
  headings : headings,
  raw :JSON.stringify(raw) ,
  parentItem : JSON.stringify(parentItem[0]) ,
  entry : entry, 
  layout: false,
});
});
});
}


//////////////////////////////////////////////////////
////       DEPLOY THE REQUESTED TEMPLATE         //// 
////////////////////////////////////////////////////
exports.templateload = function(req, res) {
  console.log('//////////////////////////////////////////////////////////////////////////////')
  console.log('//////////////////////////////////////////////////////////////////////////////')
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

///////////////////////////////////////////////////
////       SEND THE DATABASE INFORMATION      //// 
/////////////////////////////////////////////////
exports.templatename = function(req, res) {
  var template = req.param('template') 
  res.render('tools/'+template, {layout:false}, function(err, html) {
    if(err) {
      var html = ''
        res.send(html);
    } else {
        res.send(html);
    }
  });
}

 

//////////////////////////////////////////////
////       GET AND SEND JSTREE DATA      //// 
////////////////////////////////////////////
exports.jstree = function(req, res) {
  var ids = req.param('ids')

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

  var query1 = heavyliftingModel.find(
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
    res.send(JSON.stringify(temp))
  })
})


}

//////////////////////////////////////////////////////
////       DEPLOY THE REQUESTED TEMPLATE         //// 
////////////////////////////////////////////////////
exports.parentid = function(req, res ) {
//Which id data to use.
var ids = req.param('ids')
if (!ids) {
  ids =""
}

if (ids == "") {
  heavyliftingModel.find().limit(2).exec(function (err, data) {
    if(err){console.log('Error Here'); return;}
    ids = data[1]._id
    console.log(ids,'this is the first check area')
//Query to find the menu item selected.
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
  //Query to find all of the database items for that menu.
  var query1 = heavyliftingModel.find(
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

  //Gratuitous hack here for the err check on the empty string search. What a mess.
  query.exec(function (err, menuitem) {
   if(err){console.log('Error Here'); return;}  
   query1.exec(function (err, databaseitems) {
    if(err){console.log('Error Here'); return;} 
    if (menuitem) {
            //undefined error handling on the template
            if (!menuitem[0].entry.template){
              menuitem[0].entry.template=''
            }
          //blank error handling on the template
          if (menuitem[0].entry.template !== ''){
            var template = menuitem[0].entry.template
          } else {
            var template = 'databasetablelist'  
          }
          //the menu item elementid should arrive populated to avoid confusion.
          if(menuitem[0].elementID==''){
            menuitem[0].elementID = menuitem[0]._id
          }
          var temp = menuitem[0]
        } else {
          var temp = ""
          var template = 'databasetablelist'  
        }
        res.render(template, {
          databaseitems : JSON.stringify(databaseitems),
          menuitem : JSON.stringify(temp),
          layout:false,
        });

      })
 })
});
} else {
//Query to find the menu item selected.
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
  //Query to find all of the database items for that menu.
  var query1 = heavyliftingModel.find(
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
  //Gratuitous hack here for the err check on the empty string search. What a mess.
  query.exec(function (err, menuitem) {
    if(err){console.log('Error Here'); return;} 
    if (menuitem) {
            //undefined error handling on the template
            if (!menuitem[0].entry.template){
              menuitem[0].entry.template=''
            }
  //routing for the template selected.
  switch (true){
    case (menuitem[0].entry.template !== ''):
    var template = menuitem[0].entry.template
    if (menuitem[0].entry.template == 'viewall') {

      query1 = heavyliftingModel.find(
      {
        "active": "true" 
      })
    }
    break;
    default:
    var template = 'databasetablelist' 
    break;
  }
          //the menu item elementid should arrive populated to avoid confusion.
          if(menuitem[0].elementID==''){
            menuitem[0].elementID = menuitem[0]._id
          }
          var temp = menuitem[0]
        } else {
          var temp = ""
          var template = 'databasetablelist'  
        }

        query1.exec(function (err, databaseitems) {
          if(err){console.log('Error Here'); return;} 
          res.render(template, {
            databaseitems : JSON.stringify(databaseitems),
            menuitem : JSON.stringify(temp),
            layout:false,
          });
        })
      })
}
}

/////////////////////////////////////
////       GET DATABASE         //// 
///////////////////////////////////
exports.getshortdata = function(req, res) {
  heavyliftingModel.find().limit(14).exec(function (err, data) {
    if(err){console.log('Error Here'); return;}
    res.send(JSON.stringify(data));
  });
}

///////////////////////////////////////////////////
////       SEND THE DATABASE INFORMATION      //// 
/////////////////////////////////////////////////
exports.tree = function(req, res) {
 res.render('tree', {
  title: 'Tree',
  siteName : siteName,
});
}

///////////////////////////////////////////////////
////       SEND THE DATABASE INFORMATION      //// 
/////////////////////////////////////////////////
exports.getDataTree = function(req, res) {
  heavyliftingModel.find().exec(function (err, data) {
    if(err){console.log('Error Here'); return;}
    res.send(JSON.stringify(data));
  });
}

//////////////////////////////////////////////////// 
///////////   GET THE FORM FIELD ALPAC/////////////
//////////////////////////////////////////////////
exports.getformfield = function(req, res) {
console.log('///////////   getformfield   ////////////')
console.log(req.param('data'))
console.log('///////////   getformfield   ////////////')
var ids = req.param('data')
if (!ids) {
  ids =''
}
var temp = "entry."+ids
///////////////////////////////////////////////
//  FIND ACTIVE ITEMS WITH ENTRY KEY OF ID  //
/////////////////////////////////////////////
//Query to find the menu item selected.
var query = heavyliftingModel.find(
{
  $and : 
  [
    {
       [temp] : { $exists : true } 
    }, 
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
  console.log('Debug 4.',query_return)
res.send(JSON.stringify(query_return));
//a parent ID for the group to pull , then a filter by the ID field.
})
 
}
//////////////////////////////////////////
///////////   READ  GROUPS  /////////////
////////////////////////////////////////
exports.groups = function(req, res) {
heavyliftingModel.
  find({
        'entry.parent' :req.param('data'),
        'active' : 'true'
  }).
  exec(function (err, docs1) {
    if(err){console.log('Error Here'); return;}    
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
console.log('-----------groups------------')
console.log('docs1 : ',JSON.stringify(docs1))
console.log('-----------groups------------')
/////////////////////////////
////      DEBUG         //// 
///////////////////////////   
    res.send(JSON.stringify(docs1));
  });
}

//////////////////////////////////////////
///////////   LOAD NAVMENU  /////////////
////////////////////////////////////////
exports.navmenuload = function(req, res) {
  heavyliftingModel.find().limit(150).exec(function (err, init) {
    if(err){console.log('Error Here'); return;}
    var temp = init[109]._id
    //objectid in mongo needs to be a string to query by.
    temp = temp.toString()
    heavyliftingModel.find({
      'entry.parent' : temp,
      'active' : 'true'
    }).exec(function (err, navmenu) {
          if(err){console.log('Error Here'); return;}      
            /////////////////////////////
            ////      DEBUG         //// 
            ///////////////////////////
            console.log('-----------navmenuload------------')
            console.log('navmenu : ',JSON.stringify(navmenu))
            console.log('-----------navmenuload------------')
            /////////////////////////////
            ////      DEBUG         //// 
            ///////////////////////////   
            res.send(JSON.stringify(navmenu));
        });
  })
}
 
////////////////////////////////////////////
///////////   LOAD COMP MENU  /////////////
//////////////////////////////////////////
exports.loadcompmenu = function(req, res) {
var ids = '58d9f9d597285841701acbdb'
    heavyliftingModel.find({
      'parentid' : ids,
      'active' : 'true'
    }).exec(function (err, navmenu) {
    if(err){console.log('Error Here'); return;}      
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
console.log('-----------loadcompmenu------------')
console.log('navmenu : ',JSON.stringify(navmenu))
console.log('-----------loadcompmenu------------')
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
    res.send(JSON.stringify(navmenu));
  });
}

////////////////////////////////////////////
///////////   LOAD USER MENU  /////////////
//////////////////////////////////////////
exports.loadusermenu = function(req, res) {
var usermenu = '58d9ea35c22b040488546f13'
var adminmenu = '58d9faaf97285841701acbdf'
var navmenu = '58fc699d7a525938d01fbd66'
    heavyliftingModel.find({
      'parentid' : usermenu,
      'active' : 'true'
    }).exec(function (err, user) {
    if(err){console.log('Error Here'); return;}   
    heavyliftingModel.find({
      'parentid' : adminmenu,
      'active' : 'true'
    }).exec(function (err, admin) {
    if(err){console.log('Error Here'); return;}      
      

    heavyliftingModel.find({
      'entry.parent' : navmenu,
      'active' : 'true'
    }).exec(function (err, navmenu) {
          if(err){console.log('Error Here'); return;} 



    var temp = {
      user :user,
      admin :admin,
      navmenu:navmenu
    }
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
console.log('-----------loadusermenu------------')
//console.log('temp : ',JSON.stringify(temp))
console.log('-----------loadusermenu------------')
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
    res.send(JSON.stringify(temp));
  });
  });
    });
}
 
////////////////////////////////////////////////////
////       GET FORM AND DATA | ONLY FORM       //// 
//////////////////////////////////////////////////
exports.getdatacomp = function(req, res) {
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
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
console.log('-----------getdatacomp------------')
console.log('formdata : ',JSON.stringify(formdata))
console.log('idItem : ',JSON.stringify(idItem))
console.log('raw :',JSON.stringify(raw))
console.log('-----------getdatacomp------------')
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
//find all of the parentid equal .
    heavyliftingModel.find({
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
console.log('-----------getdatacomp------------')
console.log('form : ',JSON.stringify(form))
console.log('-----------getdatacomp------------')
      res.send({
        formdata : form , 
        idItem : temp
      });
 })
  })
}


////////////////////////////////////////////////////
////       GET FORM AND DATA | ONLY FORM       //// 
//////////////////////////////////////////////////
exports.getdata = function(req, res) {
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
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
console.log('-----------getdata------------')
console.log('formdata : ',JSON.stringify(formdata))
console.log('idItem : ',JSON.stringify(idItem))
console.log('raw :',JSON.stringify(raw))
console.log('-----------getdata------------')
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
var temp =""
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
var query = heavyliftingModel.find(
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
query.exec(function (err, docs1) {
  if(err){console.log('Error Here'); return;}
  query1.exec(function (err, docs2) {
    if(err){console.log('Error Here'); return;}
    var temp = docs2[0] 
      //if the entry id is blank then autopopulate the entry ID with the current ID.
      if (docs2[0].elementID == ''   ) {
        docs2[0].elementID = docs2[0]._id
        docs2[0].revision = 'updated'
      }
      if (docs2.length == 0) {
        temp=''
      }
/////////////////////////////
////      DEBUG         //// 
///////////////////////////
console.log('-----------getdata stage 2------------')
console.log('formdata : ',docs1[0])
console.log('idItem : ',temp)
console.log('docs1 :',docs1[0].entry)
console.log('docs2 :',docs2[0].entry)
console.log('-----------getdata stage 2------------')
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



//////////////////////////////////////////////////////
////       DEPLOY THE REQUESTED TEMPLATE         //// 
////////////////////////////////////////////////////
exports.singleidcall = function(req, res) {
console.log('////////////////////////////////////////////')
console.log('This is singleidcall : ',req.param('ids'))
console.log('////////////////////////////////////////////')
//Which id data to use.
var ids = req.param('ids')
if (!ids) {
  ids =''
}
  

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
if(err){
  console.log('query_return failed'); 
} 

var query1id = query_return.parentid
///////////////////////////
// 2.RETURN CHILD ITEM  //
/////////////////////////
var query1 = heavyliftingModel.findOne(
{
  $and : 
  [
  {$or: [
    {"elementID": query1id },
    {"_id":  query1id }
    ]}, 
    {
      "active": "true" 
    }
    ]
  })

query1.exec(function (err, query1_return) { 
if(err){
  console.log('query1_return failed'); 
} 

var query2id = query1_return.childType
//////////////////////
// 3.GET THE FORM  //
////////////////////
var query2 = heavyliftingModel.find(
{
  $and : 
  [
  {
    "parentid": query2id 
  }, 
  {
    "active": "true" 
  }
  ]
})

query2.exec(function (err, query2_return) { 
if(err){
  console.log('query2_return failed'); 
} 



if(query_return){
for (var i = 0; i < query_return.length; i++) {
      //the menu item elementid should arrive poulated to avoid confusion.
    if(query_return[i].elementID==''){
      query_return[i].elementID=query_return[i]._id
    }
}
}else {
  console.log('query_return failed')
}
if(query1_return){
for (var i = 0; i < query1_return.length; i++) {
      //the menu item elementid should arrive poulated to avoid confusion.
    if(query1_return[i].elementID==''){
      query1_return[i].elementID=query1_return[i]._id
    }
}
}else {
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
console.log('//  Debug from here  //')
console.log('query_return',query_return)
console.log('query1_return',query1_return)
console.log('query2_return',query2_return)
 
 
 

var json = {
            query  :   query_return,
            query1 :   query1_return,
            query2 :   query2_return,
}

          res.send( json  );
 

//query end
});

//query end
});
//query end
});
}


//////////////////////////////////////////////////////
////       DEPLOY THE REQUESTED TEMPLATE         //// 
////////////////////////////////////////////////////
exports.findme = function(req, res) {
console.log('//////////////////////////////////////////////////////////////////////////////')
console.log('/////////////////////////////      findme     ////////////////////////////////')
console.log('//////////////////////////////////////////////////////////////////////////////')
console.log('This is starting',req.param('ids'))
//Which id data to use.
var ids = req.param('ids')
if (!ids) {
  ids =''
}
 
////////////////////////////////////////
//  1.RETURN CHILD TYPE OF SELECTED  //
//////////////////////////////////////
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
 if(query_return){
  for (var i = 0; i < query_return.length; i++) {
        //the menu item elementid should arrive poulated to avoid confusion.
        if(query_return[i].elementID==''){
          query_return[i].elementID=query_return[i]._id
        }
      }
    } else {
      console.log('query_return failed')
    } 

//////////////////////
// 3.GET THE FORM  //
////////////////////
var query1 = heavyliftingModel.find(
{
  $and : 
  [
  {
    "parentid": query_return.childType 
  }, 
  {
    "active": "true" 
  }
  ]
})


 



query1.exec(function (err, query_return1) {
 if(err){console.log('Error Here'); return;}
 if(query_return1){
  for (var i = 0; i < query_return1.length; i++) {
        //the menu item elementid should arrive poulated to avoid confusion.
        if(query_return1[i].elementID==''){
          query_return1[i].elementID=query_return1[i]._id
        }
      }
    } else {
      console.log('query_return1 failed')
    } 


    console.log('//  Debug from here findme //')
    console.log('query_return',query_return)
    console.log('query_return1',query_return1)
    console.log('//  Debug from here findme //')
    res.send( {
      query  :  query_return,
      query1  :  query_return1
    });

//Query end
})    
//Query end
}) 
}
