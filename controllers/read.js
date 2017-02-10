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
    case(forms.length == 1  ):
      formdata = forms[0]._id
    break;
    case(forms.length == 2  ):
      formdata = forms[1]._id
    break;
  }
 

 
  res.render('form', {
    title: 'Form',
    siteName : siteName,
    formdata : JSON.stringify(formdata),
    idItem : JSON.stringify(idItem),
    parentid : JSON.stringify(parentid),
    raw :JSON.stringify(raw) ,
    layout: false,
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

//used for the database items which require a location from which the data was created.
var parentid = req.param('parentid')
  if (!parentid) {
    parentid ='false'
  }

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

    query1.exec(function (err, databaseitems) {
      if (err) { return next(err); } 

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
   
        //the menu item elementid should arrive poulated to avoid confusion.
        if(menuitem[0].elementID==''){
          menuitem[0].elementID=menuitem[0]._id
        }

        res.render(template, {
          databaseitems : JSON.stringify(databaseitems),
          menuitem : JSON.stringify(menuitem[0]),
          layout:false,
          templateload : JSON.stringify(ids)
        });

      })
  })
 
}

///////////////////////////////////////////////////
////       SEND THE DATABASE INFORMATION      //// 
/////////////////////////////////////////////////
exports.database = function(req, res) {
//get the forth element id in the database
heavyliftingModel.find().limit(5).exec(function (err, forms) {
  if (err) { return next(err); }
   res.render('database', {
    title: 'Database',
    siteName : siteName,
    databaseId : JSON.stringify(forms[4]._id), 
  });
});
}

//////////////////////////////////////////////
////       GET AND SEND JSTREE DATA      //// 
////////////////////////////////////////////
exports.jstree = function(req, res) {
  var ids = req.param('ids')
  var query = heavyliftingModel.find(
      {
        "active": "true" ,
        "parentid": ids,      
      })

   query.exec(function (err, docs1) {
    if (err) { return next(err); } 
      res.send(JSON.stringify(docs1))
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

        console.log(databaseitems,ids, 'This needs to be longer than zero length')



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
    query1.exec(function (err, databaseitems) {
      if (err) { return next(err); } 

        console.log(databaseitems,ids, 'This needs to be longer than zero length')



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
  }
 

  
 
}



/////////////////////////////////////
////       GET DATABASE         //// 
///////////////////////////////////
exports.getshortdata = function(req, res) {

heavyliftingModel.find().limit(4).exec(function (err, data) {
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