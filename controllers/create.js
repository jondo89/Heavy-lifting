var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;


//Create an entry
exports.create = function(req, res) {
	var dataset = req.body	

	console.log('/////////////DEBUG CREATE FOR ACTIVE =TRUE //////////////')
	console.log('Init req.body',dataset)
	console.log(dataset.elementID)
	console.log('/////////////DEBUG CREATE FOR ACTIVE =TRUE //////////////')

//Imidiate login redirect.
if (req.user) {

} else {

		console.log('/////////////NOT LOGGED IN //////////////')
 
  console.log('/////////////NOT LOGGED IN //////////////')
  res.send({redirect: '/signin'});
}


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



console.log('/////////////DEBUG CREATE FOR ACTIVE =TRUE //////////////')
console.log('Init req.body',dataset)
console.log('/////////////DEBUG CREATE FOR ACTIVE =TRUE //////////////')



if (req.user) {
	userid = req.user.id
	dataset.userID = userid
//admin 1
//'586b5bbe935a6d19040c5447'
//admin 2
//'5878b000d1f7c0220c1d2903'
if (userid == '586b5bbe935a6d19040c5447' | userid == '5878b000d1f7c0220c1d2903') {
	console.log('user id is working')
	if (dataset.elementID !='') {
		console.log('step 1 - dataset.elementID : ',dataset.elementID)
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
		var create = new heavyliftingModel(dataset);  
		create.save(function (err, doc) {  
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
			var create = new heavyliftingModel(dataset);  
			create.save(function (err, doc) {  
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



};

