var organizationalModel      = require('../models/organizations.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;

////////////////////////////////////////////
/////  GO TO PAGE NEW ORGANIZATION    ///// 
//////////////////////////////////////////
exports.neworg = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
	res.render('neworg')
} else {
res.redirect('/signin');
}
}; 

///////////////////////////////////////////////
///////   CREATE ORGINIZATION STATIC  ////////
/////////////////////////////////////////////
exports.createorgstatic = function(req, res) {

//Allow for new credit cards every time , Do not call old CC details.	
if (req.user) {

req.assert('name', 'Username cannot be blank').notEmpty();
req.assert('email', 'Email is not valid').isEmail();
req.assert('email', 'Email cannot be blank').notEmpty();
req.assert('password', 'Password must be at least 8 characters long').len(8);
req.sanitize('email').normalizeEmail({ remove_dots: false });
var errors = req.validationErrors();
if (errors) {
	req.flash('error', errors);
	return res.redirect('/signup');
}
 
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.body.name }, function(err, username) {
    	if (username) {
    		req.flash('error', { msg: 'The Organizational name you have entered is already associated with another account.' });
    		return res.redirect('/signup');
    	}
var temp = {}
    	 temp['entry'] ={
    		name: req.body.name,
    		email: req.body.email,
    		password: req.body.password,
    		permission : 'subscriber',
    		owner : req.user.username,
    		members : ''
    	}        
    		user = new organizationalModel(temp);
    	user.save(function(err) {
    		req.logIn(user, function(err) {
    			res.redirect('/orginizations/'+req.body.name);
    		});
    	});
    });
 

} else {
 res.redirect('/signin');
}
}



////////////////////////////////////////////
////////// PROFILE ORGANIATION ////////////
//////////////////////////////////////////
exports.orgprofile = function(req, res) {
      res.render('account/orgprofile');
};