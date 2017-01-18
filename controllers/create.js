var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;


//Create an entry
exports.create = function(req, res) {

var dataset = req.body	

if (!dataset.elementID) {
dataset.elementID =  dataset._id
} 
delete dataset._id

if (req.user) {
      userid = req.user.id
      dataset.userID = userid
//admin 1
//'586b5bbe935a6d19040c5447'
//admin 2
//'5878b000d1f7c0220c1d2903'
if (userid == '586b5bbe935a6d19040c5447' | userid == '5878b000d1f7c0220c1d2903') {

if (dataset.elementID !='') {
	console.log(dataset,'herer')
	heavyliftingModel.update(
	{
	  $and : 
	  [
	  {$or: [
	    {"elementID": dataset.elementID},
	    {"_id": dataset.elementID}
	    ]}, 
	    {
	      "active": true ,
	    }
	    ]
	  },
	  {$set: { 'active': false }},
	  {multi: true,upsert: true,}).exec(function (err) {
	    if (err) {
	      if (err.name === 'MongoError' && err.code === 11000) {
	      // Duplicate username
	      return res.status(500).send({ succes: false, message: 'User already exist!' });
	      }
	      // Some other error
	      return res.status(500).send(err);
	      }
	})
}

 console.log(dataset,'return')
var create = new heavyliftingModel(dataset);  
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
 
 