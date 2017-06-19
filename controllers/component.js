var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;


///////////////////////////////////////////////
////       NEW COMPONENT TEMPLATE         //// 
/////////////////////////////////////////////
exports.newcomp = function(req, res) {
	if (req.user) {
		res.render('newcomp',{
			organizations : req.userorgs ,
			componentlist : req.componentlist,
			componentlistParse : req.componentlistParse,
			title: 'New Component | Heavy-lifting',
		})
	} else {
		res.redirect('/signup')
	}
}

exports.usersview = function(req, res) {
	res.render('newcomp',{
		title: 'Components | Heavy-lifting',
	})
}

exports.users = function(req, res) {
	res.render('newcomp',{
		title: 'Components | Heavy-lifting',
	})
}

exports.compiduser = function(req, res) {
	res.render('newcomp',{
		title: 'Components | Heavy-lifting',
	})
}

exports.organizationsview = function(req, res) {
	res.render('newcomp',{
		title: 'Components | Heavy-lifting',
	})
}

exports.organizations = function(req, res) {
	res.render('newcomp',{
		title: 'Components | Heavy-lifting',
	})
}

exports.compidorg = function(req, res) {
	res.render('newcomp',{
		title: 'Components | Heavy-lifting',
	})
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Page Controllers - rebuild

///////////////////////////////////////////////
////       COMPONENT PAGE ROUTING         //// 
/////////////////////////////////////////////
exports.components = function(req, res) {
	if (req.user) {
		var ids = '58d371b01373c63dccdee169'
		var Formids = '58aa74140b9d3241280ecf17'
		res.render('components', {
			siteName : siteName,
			items : JSON.stringify(ids),
			Formids : JSON.stringify(Formids)
		});	
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

//////////////////////////////////////////////////////////////
////       COMPONENT PAGE ROUTING - SUPERADMIN           //// 
////////////////////////////////////////////////////////////
exports.componentssuperadmin = function(req, res) {
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
			res.redirect('/signin')
		}
	} else {
		res.redirect('/signin')
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Middelware -  Limit to 1 query.

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
//console.log(query1_return,'query1_return componentforms')
req.componentlist = query1_return
req.componentlistParse = JSON.stringify(query1_return)
next();
})
}

////////////////////////////////////////////////////////////////////////////////////
////       COMPONENT LIST TO RETURN THE INDIVIDUAL COMPONENTS BY USER          //// 
//////////////////////////////////////////////////////////////////////////////////
exports.usercomponents = function(req, res, next) {
//verify the string query.
if (req.componentlist) {
	var componentlist = req.componentlist
	var parentidlist =[]
	for (var i = 0; i < componentlist.length; i++) {
		parentidlist.push(componentlist[i].elementID)
	}
	var query1 = heavyliftingModel.find(
		{"parentid": parentidlist ,
		"userowner": req.params.username }
		)
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
//console.log(query1_return,'query1_return usercomponents')
req.componentlistall = query1_return
req.componentlistParseall = JSON.stringify(query1_return)
next();
})
} else {
	console.log('Something when wrong with the stringed query usercomponents.')
	res.redirect('/')
}
}

/////////////////////////////////////////////////////////////////////////////////////////////
////       COMPONENT LIST TO RETURN THE INDIVIDUAL COMPONENTS BY USER|ORGANIZATION      //// 
///////////////////////////////////////////////////////////////////////////////////////////
exports.organizationcomponents = function(req, res, next) {
//verify the string query.
if (req.componentlist) {
	if (req.organizations) {
		var componentlist = req.componentlist
		var organizations = req.organizations
		var parentidlist =[]
		var orglist =[]
		for (var i = 0; i < componentlist.length; i++) {
			parentidlist.push(componentlist[i].elementID)
		}
		for (var i = 0; i < organizations.length; i++) {
			orglist.push(organizations[i].entry.name)
		}

console.log(orglist,parentidlist)

		var query1 = heavyliftingModel.find(
			{"parentid": parentidlist ,
			"organizationowner": orglist }
			)
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
//console.log(query1_return,'query1_return organizationcomponents')
req.userorgcomplist = query1_return
req.userorgcomplistParse = JSON.stringify(query1_return)
next();
})
	} else {
		console.log('Something when wrong with the stringed query organizationcomponents.')
		res.redirect('/')
	}
} else {
	console.log('Something when wrong with the stringed query organizationcomponents1.')
	res.redirect('/')
}
}