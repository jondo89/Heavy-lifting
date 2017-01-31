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

//This is used to pull the first 2 entries from the database. 
//will return the ids for the form data on the primer and raw database entry.
heavyliftingModel.find().limit(2).exec(function (err, forms) {
  //The primer and Raw are the first 2 items in the database.
  //This does mean the that the forms are not being edited.
  switch(true){
    case(formdata=='edit'):
    formdata = forms[0]._id
    break;
    case(formdata=='raw'):
    formdata = forms[1]._id
    break;
  }


  res.render('form', {
    title: 'Form',
    siteName : siteName,
    formdata : JSON.stringify(formdata),
    idItem : JSON.stringify(idItem),
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

console.log('Loading on this side of the srver',formdata,idItem,raw)

  var temp =""
  var query1 = heavyliftingModel.find(
    {
      "_id":  idItem
    }
  )
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
var template = req.param('template')
  if (!template) {
    template =''
  }

  res.render(template, {
    siteName : siteName,
    layout: false,
  });
}

///////////////////////////////////////////////////
////       SEND THE DATABASE INFORMATION      //// 
/////////////////////////////////////////////////
exports.database = function(req, res) {
 
  var query = heavyliftingModel.find(
      {
        "active": "true" ,
        "objectType": "data" ,      
      })

   query.exec(function (err, docs1) {
    if (err) { return next(err); } 

  res.render('database', {
    title: 'Database',
    siteName : siteName,
    database : JSON.stringify(docs1), 
  });


  })

}