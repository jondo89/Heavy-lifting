var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;


//////////////////////////////////////////////////////
////       DEPLOY THE REQUESTED TEMPLATE         //// 
////////////////////////////////////////////////////
exports.newcomp = function(req, res) {
if (req.user) {
	res.render('newcomp',{
		organizations : req.userorgs ,
		componentlist : req.componentlist,
		componentlistParse : req.componentlistParse
	})
} else {
	res.redirect('/signup')
}
}

exports.components = function(req, res) {
if (req.user) {
if (req.user.permission =='superadmin') {
    var ids = '58d371b01373c63dccdee169'
    var Formids = '58aa74140b9d3241280ecf17'
    res.render('componentsadmin', {
      siteName : siteName,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
 } else {
	var ids = '58d371b01373c63dccdee169'
	var Formids = '58aa74140b9d3241280ecf17'
	res.render('components', {
		siteName : siteName,
		items : JSON.stringify(ids),
		Formids : JSON.stringify(Formids)
	});	
 }


} else {
	var ids = '58d371b01373c63dccdee169'
	var Formids = '58aa74140b9d3241280ecf17'
	res.render('components', {
		siteName : siteName,
		    title: 'Components | Heavy-lifting',
		items : JSON.stringify(ids),
		Formids : JSON.stringify(Formids)
	});
}



}

exports.usersview = function(req, res) {
	res.render('newcomp')
}

exports.users = function(req, res) {
	res.render('newcomp')
}

exports.compiduser = function(req, res) {
	res.render('newcomp')
}

exports.organizationsview = function(req, res) {
	res.render('newcomp')
}

exports.organizations = function(req, res) {
	res.render('newcomp')
}

exports.compidorg = function(req, res) {
	res.render('newcomp')
}

////////////////////////////////////////////
/////      COMPONENT LIST MIDDLEWARE  /////
//////////////////////////////////////////
exports.componentforms = function(req, res, next) {
//Due to the nature of the structrue , it has to be bottom up . As such the list of componetnts to call has to be defined.	
var componetsToCall = [
 
'58fc4d137a525938d01fbd4f',
'5902cfc1d8bc512b40c9b172',
'58fc8ec17272c0425864d8c7',
'59044d82f588ab3c34e267b1',
'5902fa49e39d634468d2b7a3',
'58fdb5100c8b981ccc7c242c',
]
if (req.user) {
	var query1 = heavyliftingModel.find(
	{
		$and : 
		[
		{$or: [
			{"elementID": componetsToCall },
			{"_id":  componetsToCall }
			]}, 
			{
				"active": "true" 
			}
			]
		})
	query1.exec(function (err, query1_return) {
		if(err){console.log('Error Here'); return;} 
//autopoulate the elementID
if(query1_return){
	for (var i = 0; i < query1_return.length; i++) {
        //the menu item elementid should arrive poulated to avoid confusion.
        if(query1_return[i].elementID==''){
        	query1_return[i].elementID=query1_return[i]._id
        }
    }
} else {
	console.log('query1_return failed')
} 
	req.componentlist = query1_return
	req.componentlistParse = JSON.stringify(query1_return)
	next();
})
} else {
	next();
}
}

////////////////////////////////////////////////////
/////      ADDITIONAL FORM DETAIL MIDDLEWARE  /////
//////////////////////////////////////////////////
exports.additionaldetails = function(req, res, next) {

var formdata = req.param('formdata')
if (!formdata || formdata=='') {
  formdata ='false'
}

if (req.user) {
	var query1 = heavyliftingModel.find(
	{
	  $and : 
	  [
	  {
	    "parentid": formdata 
	  }, 
	  {
	    "active": "true" 
	  }
	  ]
	})
	query1.exec(function (err, query1_return) {
		if(err){console.log('Error Here'); return;} 
//autopoulate the elementID
if(query1_return){
	for (var i = 0; i < query1_return.length; i++) {
        //the menu item elementid should arrive poulated to avoid confusion.
        if(query1_return[i].elementID==''){
        	query1_return[i].elementID=query1_return[i]._id
        }
    }
} else {
	console.log('query1_return failed')
} 


	req.additionaldetails = query1_return
	req.additionaldetailsParse = JSON.stringify(query1_return)
	next();
})
} else {
	next();
}
}
