var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;


//Create an entry
exports.create = function(req, res) {

var dataset = req.body	



if (dataset.revision != 'created') {
	//this is the area where the items are assigned the Elment ID.
	//In the event of the revision being created , the element ID will need to be blank.
	if (!dataset.elementID) {
		dataset.elementID =  dataset._id
	} 
	delete dataset._id
} else {
	delete dataset._id
}
if (req.user) {
      userid = req.user.id
      dataset.userID = userid
//admin 1
//'586b5bbe935a6d19040c5447'
//admin 2
//'5878b000d1f7c0220c1d2903'
if (userid == '586b5bbe935a6d19040c5447' | userid == '5878b000d1f7c0220c1d2903') {
if (dataset.elementID !='') {
	heavyliftingModel.update(
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
	})
}
console.log(dataset,'the create dataset')
 
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
 
 