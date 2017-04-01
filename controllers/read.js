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
  if (err) { return next(err); }
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
if (!parentid) {
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
  if (err) { return next(err); }

//This is used to pull the first 2 entries from the database. 
//will return the ids for the form data on the primer and raw database entry.
heavyliftingModel.find().limit(3).exec(function (err, forms) {
  if (err) { return next(err); }
  //The primer and Raw are the first 2 items in the database.
  //This does mean the that the forms are not being edited.
  switch(true){
    case(raw == 'edit'):
    formdata = forms[0]._id
    break;
    case(raw == 'raw'):
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
  if (err) { return next(err); }
  query1.exec(function (err, docs2) {





    if (err) { return next(err); }
    var temp = docs2[0] 
      //if the entry id is blank then autopopulate the entry ID with the current ID.
      if (docs2[0].elementID == ''  ||  docs2[0].revision == 'created') {
        docs2[0].elementID = docs2[0]._id
        docs2[0].revision = 'updated'
      }
      if (docs2.length == 0) {
        temp=''
      }


/////////////////////////////
////      DEBUG         //// 
///////////////////////////
/*
console.log('-----------getdata stage 2------------')
console.log('formdata : ',docs1[0])
console.log('idItem : ',temp)
console.log('docs1 :',docs1[0].entry)
console.log('docs2 :',docs2[0].entry)
console.log('-----------getdata stage 2------------')

*/
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
exports.templateload = function(req, res) {
//Which id data to use.
var ids = req.param('ids')
if (!ids) {
  ids =''
}
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
  query.exec(function (err, menuitem) {
    if (err) { return next(err); } 
      //undefined error handling on the template
      if (!menuitem[0].entry.template){
        menuitem[0].entry.template=''
      }
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
        //the menu item elementid should arrive poulated to avoid confusion.
        if(menuitem[0].elementID==''){
          menuitem[0].elementID=menuitem[0]._id
        }

        query1.exec(function (err, databaseitems) {
          if (err) { return next(err); }
          res.render(template, {
            databaseitems : JSON.stringify(databaseitems),
            menuitem : JSON.stringify(menuitem[0]),
            raw : JSON.stringify(menuitem[0].entry.layout),
            layout:false,
            templateload : JSON.stringify(ids)
          });

        })
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
  if (err) { return next(err); } 
  query1.exec(function (err, docs1) {
    if (err) { return next(err); } 
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
    if (err) { return next(err); }
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
   if (err) { return next(err); }  
   query1.exec(function (err, databaseitems) {
    if (err) { return next(err); } 
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
    if (err) { return next(err); } 
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
          if (err) { return next(err); } 
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
    if (err) { return next(err); }
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
    if (err) { return next(err); }
    res.send(JSON.stringify(data));
  });
}

//////////////////////////////////////////////////// 
///////////   GET THE FORM FIELD ALPAC/////////////
//////////////////////////////////////////////////
exports.getformfield = function(req, res) {
  console.log('////////////////////////////////')
  console.log('   Debug Enter Here')
  console.log('////////////////////////////////')
  heavyliftingModel.find().limit(100).exec(function (err, init) {
    if (err) { return next(err); }



    switch(true){
      case (req.param('data') == 'objectType'):
      res.send(JSON.stringify(['form','database']));
      break;
      case (req.param('data') == 'revision'):
      res.send(JSON.stringify(['created','updated','deleted']));
      break;
      case (req.param('data') == 'active'):
      res.send(JSON.stringify(['true','false']));
      break;

      case (req.param('data') == 'buttons'):
      heavyliftingModel.find({
        'parentid' : init[84]._id,
        'active' : 'true'
      }).exec(function (err, data) {
        if (err) { return next(err); }
        var temp = []
        for (var i = 0; i < data.length; i++) {
          temp.push(data[i].entry.value)
        }
        res.send(JSON.stringify(temp));
      });
      break;


      case (req.param('data') == 'type'):
      heavyliftingModel.find({
        'parentid' : '58df43d40cef901b8c1bb474',
        'active' : 'true'
      }).exec(function (err, data) {
        if (err) { return next(err); }
        var temp = []
        for (var i = 0; i < data.length; i++) {
          temp.push(data[i].entry.value)
        }
        res.send(JSON.stringify(temp));
      });
      break;


      case (req.param('data') == 'tabs'):
      heavyliftingModel.find({
        'parentid' : init[56]._id,
        'active' : 'true'
      }).exec(function (err, data) {
        if (err) { return next(err); }
        var temp = []
        for (var i = 0; i < data.length; i++) {
          temp.push(data[i].entry.value)
        }
        res.send(JSON.stringify(temp));
      });
      break;

      case (req.param('data') == 'layout'):
      heavyliftingModel.find({
        'parentid' : init[24]._id,
        'active' : 'true'
      }).exec(function (err, data) {
        if (err) { return next(err); }
        var temp = []
        for (var i = 0; i < data.length; i++) {
          temp.push(data[i].entry.value)
        }
        res.send(JSON.stringify(temp));
      });
      break;

      case (req.param('data') == 'template'):
      heavyliftingModel.find({
        'parentid' : init[6]._id,
        'active' : 'true'
      }).exec(function (err, data) {
        if (err) { return next(err); }
        var temp = []
        for (var i = 0; i < data.length; i++) {
          temp.push(data[i].entry.value)
        }
        res.send(JSON.stringify(temp));
      });
      break;

      case (req.param('data') == 'headings'):
      heavyliftingModel.find({
        'parentid' : init[8]._id,
        'active' : 'true'
      }).exec(function (err, data) {
        if (err) { return next(err); }
        var temp = []
        for (var i = 0; i < data.length; i++) {
          temp.push(data[i].entry.value)
        }
        res.send(JSON.stringify(temp));
      });
      break;
      case (req.param('data') == 'unit'):
      heavyliftingModel.find({
        'parentid' : init[12]._id,
        'active' : 'true'
      }).exec(function (err, data) {
        if (err) { return next(err); }
        var temp = []
        for (var i = 0; i < data.length; i++) {
          temp.push(data[i].entry.value)
        }
        res.send(JSON.stringify(temp));
      });
      break;
      case (req.param('data') == 'icon'):
      heavyliftingModel.find({
        'parentid' : init[9]._id,
        'active' : 'true'
      }).exec(function (err, data) {
        if (err) { return next(err); }
        var temp = []
        for (var i = 0; i < data.length; i++) {
          temp.push(data[i].entry.value)
        }
        res.send(JSON.stringify(temp));
      });
      break;
      default :
      heavyliftingModel.
      find({
        '_id': req.param('data'),
      }).
      sort({ Order: -1 }).
      exec(function (err, docs) {
        if (err) { return next(err); }
        heavyliftingModel.
        find({
          'menu item': docs[0]['Field'],
        }).
        sort({ Order: -1 }).
        exec(function (err, docs1) {
          if (err) { return next(err); }
    //reformat to suit alpacha
    var temp =[]
    for (var i = 0; i < docs1.length; i++) {
      temp .push( {
        "value": docs1[i]['Value'],
        "text": docs1[i]['Value']
      })
    }
    res.send(JSON.stringify(temp));
  });
      });
      break;
    }
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
    if (err) { return next(err); }    
    console.log('//////////////////////////////////')
    console.log('//////// DEBUG  GROUPS  /////////')
    console.log('////////////////////////////////')
 
    res.send(JSON.stringify(docs1));
  });
}

//////////////////////////////////////////
///////////   LOAD NAVMENU  /////////////
////////////////////////////////////////
exports.navmenuload = function(req, res) {
  heavyliftingModel.find().limit(150).exec(function (err, init) {
    if (err) { return next(err); }
    var temp = init[109]._id
    //objectid in mongo needs to be a string to query by.
    temp = temp.toString()
    heavyliftingModel.find({
      'entry.parent' : temp,
      'active' : 'true'
    }).exec(function (err, navmenu) {
    if (err) { return next(err); }      
    console.log('//////////////////////////////////')
    console.log('//////// DEBUG NAVMENU //////////')
    console.log('////////////////////////////////')      
 
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
    if (err) { return next(err); }      
    console.log('/////////////////////////////////////////')
    console.log('//////// COMPONENT MENU DEBUG //////////')
    console.log('///////////////////////////////////////')      
 
    res.send(JSON.stringify(navmenu));
  });
}

////////////////////////////////////////////
///////////   LOAD USER MENU  /////////////
//////////////////////////////////////////
exports.loadusermenu = function(req, res) {
var usermenu = '58d9ea35c22b040488546f13'
var adminmenu = '58d9faaf97285841701acbdf'
    heavyliftingModel.find({
      'parentid' : usermenu,
      'active' : 'true'
    }).exec(function (err, user) {
    if (err) { return next(err); }   
    heavyliftingModel.find({
      'parentid' : adminmenu,
      'active' : 'true'
    }).exec(function (err, admin) {
    if (err) { return next(err); }      
    console.log('//////////////////////////////////')
    console.log('//////// DEBUG NAVMENU //////////')
    console.log('////////////////////////////////')      
    var temp = {
      user :user,
      admin :admin
    }
    res.send(JSON.stringify(temp));
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
      'parentid' : idItem,
      'active' : 'true'
    }).exec(function (err, form) {
    if (err) { return next(err); } 

//turn into something that alpaca understands.


console.log('-----------ORIGINAL DATA------------')
console.log('form : ',JSON.stringify(form))
console.log('-----------ORIGINAL DATA------------')


 


      res.send({
        formdata : form  
      });

  })



}