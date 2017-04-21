var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;


//Create an entry
exports.create = function(req, res) {
	var dataset = req.body	

console.log('/////////////DEBUG CREATE FOR ACTIVE =TRUE //////////////')
	console.log('Init req.body',dataset)
	console.log('/////////////DEBUG CREATE FOR ACTIVE =TRUE //////////////')

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
	})
		}
		console.log('step 2 - dataset.childType : ',dataset.childType)
		if (dataset.childType == "" || !dataset.childType) {
			
			console.log('step 3 - dataset.childType : ',dataset.childType)
		//	heavyliftingModel.find().limit(5).exec(function (err, forms) {
			//	if (err) { return next(err); }
				//console.log('step 4 - forms : ',forms)



//this is used to default items in the database posted with out a form child id to be the 3rd entry in the databse , i.e the database form.
//if (forms.length>3) {
//	dataset.childType = forms[2]._id

	//Removed for the database update. Will likley cause other problems.
	//dataset.objectType = "database"
//}



console.log('step 5')
				//there needs to be a better way of hanlding the redirects.
				var create = new heavyliftingModel(dataset);  
				create.save(function (err, doc) {  
					console.log('step 6 - Save point for the dataset doc:',doc)
					if (err) {
						res.send(err);
					} else{
						res.send({redirect: '/admin'});
					}
				});
			//});
		} else {
			var create = new heavyliftingModel(dataset);  
			create.save(function (err, doc) {  
				console.log('step 7 - Save point for the dataset doc:',doc)
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

