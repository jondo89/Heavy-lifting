//var heavyliftingModel      = require('../models/heavylifting.js');

///////////////////////////////////////////////
////     SET YOUR APP.JSON DETAILS        //// 
/////////////////////////////////////////////
//Not working ? try double dots on the json url..
var myModule = require('../../../app.json');
var sitename = myModule.sitename
var website = myModule.website
var repo = myModule.repo
var directory =  '../'


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

exports.hadmin = function(req, res) {
  if (req.user) {
    if (req.user.permission = 'superadmin') {
      res.render(directory+'/views/hl-admin', {
        title: 'Database Admin',
        siteName : sitename,
        layout: false,
      });
    }else {
     res.redirect('/signin');
   }
 } else {
   res.redirect('/signin');
 }
};

//Create an entry
exports.create = function(req, res) {
  if (req.user) {
    userid = req.user.id
//admin 1
//'586b5bbe935a6d19040c5447'
//admin 2
//'5878b000d1f7c0220c1d2903'
if (userid == '586b5bbe935a6d19040c5447' | userid == '5878b000d1f7c0220c1d2903') {
  var create = new heavyliftingModel(req.body);  
  create.save(function (err, doc) {  
    if (err) {
      res.send(err);
    } else{
      res.redirect('/')
    }
  });
}
} else {
 userid=''
 res.redirect('/login');
}
};

//read an entry
exports.read = function(req, res) {
};

//update an entry
exports.update = function(req, res) {
};

//delete an entry
exports.delete = function(req, res) {
};