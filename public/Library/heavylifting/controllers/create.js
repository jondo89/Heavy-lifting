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
exports.create = function(req, res) {
	var dataset = req.body	
//console.log('/////////////DEBUG CREATE FOR ACTIVE = TRUE Stage 1 //////////////')
//console.log('Init req.body',dataset)
//console.log(dataset.elementID)
//console.log('/////////////DEBUG CREATE FOR ACTIVE = TRUE Stage 1 //////////////')
//Imidiate login redirect.
if (req.user) {
	//console.log('User logged in.')
	if (dataset.revision != 'created') {
			//console.log('ID Injection Step 1.')
	//this is the area where the items are assigned the Elment ID.
	//In the event of the revision being created , the element ID will need to be blank.
	//Handling of the element ID for normal and component input.
	if (!dataset.elementID) {
		//console.log('ID Injection Step 2.')
		dataset.elementID =  dataset._id
	} 
	if (dataset.entry.elementID) {
		//console.log('ID Injection Step 3.')
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
//console.log(dataset.elementID)
//console.log('/////////////DEBUG CREATE FOR ACTIVE = TRUE Stage 2 //////////////')
//console.log('Init req.body',dataset)
//console.log('/////////////DEBUG CREATE FOR ACTIVE = TRUE //////////////')
userid = req.user.id
dataset.userID = userid
if (req.user.permission == 'superadmin' | req.user._id == dataset.userID) { 
		//console.log('user id is working')
		if (dataset.elementID !=''  ) {
			//console.log('step 1 - dataset.elementID : ',dataset.elementID)
			res.locals.models[res.locals.collections[res.locals.routeSet]['datacollectionname']].update(
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
			console.log('update existing records failed')
			res.send(err);
		} else{
		}
		var create = new res.locals.models[res.locals.collections[res.locals.routeSet]['datacollectionname']](dataset);  
		create.save(function (err2, doc) {  
			if (err) {
				console.log('create new existing records failed')
				res.send(err2);
			} else{
			}
			console.log('step 6 - Save point for the dataset doc:',doc)
			res.send({redirect: '/configuration/view'});
		});
	})
			} else {
							//console.log('new items are here')
							var create = new res.locals.models[res.locals.collections[res.locals.routeSet]['datacollectionname']](dataset);  
							create.save(function (err2, doc) {  
								if (err2) {
									console.log('create new existing records failed')
									res.send(err2);
								} else{
								}
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
							//console.log(err,'Failed to save image.')
						});
						}
						console.log('step 6 - Save point for the dataset doc:')
						res.send({'redirect' : '/'});
					});
						}
					}
				} else {
					console.log('User not logged in.')
					res.send(
						{redirect: '/signin'}
						);
				}
			};

//Create an entry
exports.bulkedit = function(req, res) {
	var dataset = req.body	
	var itemCount 
	console.log('/////////////BULKEDIT CREATE ACTIVIATED //////////////')
	//Redirect to loogin if not signed in.
	//if (req.user) {
	//LOGIN REDIRECT

	var saveItem
	console.log('NUMBER OF RECORDS TO SAVE : ',dataset.length)								 
			//console.log('RECORD SET : ',dataset)	











			for (var i = 0; i < dataset.length; i++) {
				//ADD THE USER ID TO THE ELEMENT.
				//userid = req.user.id
				//dataset[i].userID = userid
				//console.log(dataset[i].userID)
				//console.log('User logged in.')
				saveItem = JSON.parse(JSON.stringify(dataset[i]))

			//if (req.user.permission == 'superadmin' | req.user._id == saveItem.userID) { 
					//console.log('user id is working')
					console.log(saveItem)
					if (saveItem.elementID !=''  ) {


						if (saveItem.revision != 'created') {
									//console.log('THIS ITEM IS A REVISION : ',i)
						//this is the area where the items are assigned the Elment ID.
						//In the event of the revision being created , the element ID will need to be blank.
						//Handling of the element ID for normal and component input.
						if (!saveItem.elementID) {
							//console.log('ID Injection Step 2.')
							saveItem.elementID =  saveItem._id
						} 
						if (saveItem.entry.elementID) {
							//console.log('ID Injection Step 3.')
							saveItem.elementID =  saveItem.entry.elementID
						} 
						delete saveItem.entry.elementID
						delete saveItem._id
					} else {
						//console.log('THIS ITEM IS NEW : ',i)	

						if (saveItem._id){
							//console.log('THIS IS NOT FULLY UNDERSTOOD #1')
							delete saveItem.entry.elementID
							delete saveItem._id
						}
					}


try {
   res.locals.models[res.locals.collections[res.locals.routeSet]['datacollectionname']].bulkWrite(
         [
         { updateMany :
            {
               "filter" : {
							$and : [
							{$or: [
								{"elementID": saveItem.elementID},
								{"_id": saveItem.elementID}
								]}, 
								{
									"active": "true" ,
								}
								]
							},
               "update" : { $set: { 
									'active': "false" 
								} }
            },

         },{ insertOne :
               {
                  "document" : saveItem
               }
            },
         ],
            { ordered : true }
      );
   
}catch (e) {
   print(e);
}

/*


						res.locals.models[res.locals.collections[res.locals.routeSet]['datacollectionname']].update(
						{
							$and : [
							{$or: [
								{"elementID": saveItem.elementID},
								{"_id": saveItem.elementID}
								]}, 
								{
									"active": "true" ,
								}
								]
							},
							{
								$set: { 
									'active': "false" 
								}
							},
							{
								multi: true
							}
							).exec(function (err,doc) {
							//,upsert: true, intitally included at this point.
							if (err) {
								//console.log('THIS RECORD SET FAILED : ')
								//res.send(err);
							} else{
								//console.log('UPDATE MODIFIED RECORD COMPLETED : ')
						 

saveItem1 = JSON.parse(JSON.stringify(saveItem))
console.log(doc)

		

					
//console.log(saveItem1)
					res.locals.models[res.locals.collections[res.locals.routeSet]['datacollectionname']](saveItem1).save(function (err2, doc) {  
						if (err2) {
							console.log('CREATING RECORD FAILED : ',err2)

						} else{
						}
						//console.log('FINISHED WRITING RECORD : ',doc)
			//res.send({redirect: '/configuration/view'});
		});
				}
			})
*/

						} else {
							console.log('ELEMENTID WAS BLANK - THIS IS BUG TO BE SOLVED')
						}
				//	}
				//Finished Update , return to client side.
				//res.send();
			}



 


/*

	//LOGIN REDIRECT
	} else {
		console.log('User not logged in.')
		res.send(
					{redirect: '/signin'}
				);
	}
	*/

};