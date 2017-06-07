var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;


//////////////////////////////////////////////////////
////       DEPLOY THE REQUESTED TEMPLATE         //// 
////////////////////////////////////////////////////
exports.newcomp = function(req, res) {
	res.render('newcomp')
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

 