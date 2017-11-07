var formsModel      = require('../models/forms.js');
var ObjectId = require('mongodb').ObjectID;

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

//Create an entry
exports.createform = function(req, res) {
  debugging(req,debugMode)
  var dataset = req.body  
//console.log('/////////////DEBUG CREATE FOR ACTIVE = TRUE Stage 1 //////////////')
//console.log('Init req.body',dataset)
//console.log(dataset.elementID)
//console.log('/////////////DEBUG CREATE FOR ACTIVE = TRUE Stage 1 //////////////')
//Imidiate login redirect.
if (req.user) {
  console.log('User logged in.')

  if (dataset.revision != 'created') {
    console.log('ID Injection Step 1.')
//this is the area where the items are assigned the Elment ID.
//In the event of the revision being created , the element ID will need to be blank.
//Handling of the element ID for normal and component input.
if (!dataset.elementID) {
  console.log('ID Injection Step 2.')
  dataset.elementID =  dataset._id
} 
if (dataset.entry.elementID) {
  console.log('ID Injection Step 3.')
  dataset.elementID =  dataset.entry.elementID
} 
delete dataset.entry.elementID
delete dataset._id
} else {
  if (dataset._id){
    console.log('ID Injection Step 4.')
    delete dataset.entry.elementID
    delete dataset._id
  }
}
console.log(dataset.elementID)
//console.log('/////////////DEBUG CREATE FOR ACTIVE = TRUE Stage 2 //////////////')
//console.log('Init req.body',dataset)
//console.log('/////////////DEBUG CREATE FOR ACTIVE = TRUE //////////////')
if (req.user) {
  userid = req.user.id
  dataset.userID = userid
//admin 1
//'586b5bbe935a6d19040c5447'
//admin 2
//'5878b000d1f7c0220c1d2903'
//Are you super admin or do you or your organization own this ?
//if (userid == '586b5bbe935a6d19040c5447' | userid == '5878b000d1f7c0220c1d2903') {
  if (req.user.permission == 'superadmin' | req.user._id == dataset.userID) { 
    console.log('user id is working')
    if (dataset.elementID !='') {
      console.log('step 1 - dataset.elementID : ',dataset.elementID)
      formsModel.update(
      {
        $and : 
        [
        {$or: [
          {"elementID": dataset.elementID},
          {"_id": dataset.elementID}
          ]}, 
          {
            "active": "true" ,
          }
          ]
        },
        {$set: { 'active': "false" }},
        {multi: true}).exec(function (err) {
    //,upsert: true, intitally included at this point.
    if (err) {
      res.send(err);
    } else{
    }
    var create = new formsModel(dataset);  
    create.save(function (err, doc) {  
//CROPTI IMAGE SAVING
if ( dataset.entry.image) {
  //id Picture saving.
  var image = dataset.entry.image
  var fs = require('fs');
  var directory = 'public/uploads/'
  var fileName = directory+dataset.elementID+'.jpg'
  var data = image.replace(/^data:image\/\w+;base64,/, '');
  fs.writeFile(fileName, data, {encoding: 'base64'}, function(err){
  //Finished
  console.log(err,'Failed to save image.')
});
}
console.log('step 6 - Save point for the dataset doc:',doc)
if (err) {
  res.send(err);
} else{
  res.send({redirect: '/admin'});
}
});
  })
      } else {
        console.log('new items are here')
        var create = new formsModel(dataset);  
        create.save(function (err, doc) {  
//CROPTI IMAGE SAVING
if ( dataset.entry.image) {
  //id Picture saving.
  var image = dataset.entry.image
  var fs = require('fs');
  var directory = 'public/uploads/'
  var fileName = directory+dataset.elementID+'.jpg'
  var data = image.replace(/^data:image\/\w+;base64,/, '');
  fs.writeFile(fileName, data, {encoding: 'base64'}, function(err){
  //Finished
  console.log(err,'Failed to save image.')
});
}
console.log('step 6 - Save point for the dataset doc:',doc)
if (err) {
  res.send(err);
} else{
  res.send({redirect: '/admin'});
}
});
      }
    }
  } else {
    console.log('step 8 - user not logged in')
    userid=''
    res.send({redirect: '/signin'});
  }
} else {
    console.log('step 8 - user not logged in')
    userid=''
    res.send({redirect: '/signin'});
}
};

