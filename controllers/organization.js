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
    console.log('//////////////////////////////////////////')
    console.log('//////  CREATE NEW ORGINIZATION  ////////')
    console.log('////////////////////////////////////////')
//Allow for new credit cards every time , Do not call old CC details.	
if (req.user) {
    req.assert('name', 'Username cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
    var errors = req.validationErrors();
    if (errors) {
       req.flash('error', errors);
       return res.redirect('/organization/new');
   }
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.body.name }, function(err, username) {
    	if (username) {
    		req.flash('error', { msg: 'The Organizational name you have entered is already associated with another account.' });
    		return res.redirect('/organization/new');
    	}
        var temp = {}
        temp['entry'] ={
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          owner : req.user.username,
          members : ''
      }        
      user = new organizationalModel(temp);
      user.save(function(err) {
          req.logIn(user, function(err) {
             res.redirect('/organizations/'+req.body.name);
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
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('account/orgprofile',{
                organization : username
            }
            )
        } else {
            return res.redirect('/');
        }
    })
}

////////////////////////////////////////////
////////// PROFILE ORGANIATION ////////////
//////////////////////////////////////////
exports.orguserread = function(req, res) {
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('account/orgprofile',{
                organization : username
            }
            )
        } else {
            return res.redirect('/');
        }
    })
}

//////////////////////////////
//////////  PAGE ////////////
////////////////////////////
exports.page = function(req, res) {
   var template =  req.params.page 
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('orgsettings/'+template,{
                organization : username
            }
            )
        } else {
            return res.redirect('/');
        }
    })
};


 ////////////////////////////////////
////////// SETTINGS PAGE ///////////
///////////////////////////////////
exports.settings = function(req, res) {
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('orgsettings/settings',{
                organization : username
            }
            )
        } else {
            return res.redirect('/');
        }
    })
};

 //////////////////////////////////////
////////// COMPONENTS PAGE ///////////
/////////////////////////////////////
exports.components = function(req, res) {
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('orgsettings/components',{
                organization : username
            }
            )
        } else {
            return res.redirect('/');
        }
    })
};


////////////////////////////////////
////////// ASSEMBLIES PAGE ////////
//////////////////////////////////
exports.assemblies = function(req, res) {
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('orgsettings/assemblies',{
                organization : username
            }
            )
        } else {
            return res.redirect('/');
        }
    })
};


///////////////////////////////////
////////// PEOPLE PAGE ///////////
/////////////////////////////////
exports.people = function(req, res) {
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('orgsettings/people',{
                organization : username
            }
            )
        } else {
            return res.redirect('/');
        }
    })
};

///////////////////////////////////
////////// ORGPUT PAGE ///////////
/////////////////////////////////
exports.orgPut = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    var errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors);
        res.redirect('/organizations/'+req.params.orgname+'/settings/profile');
    }
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, organizationItem) {
        organizationalModel.findById(organizationItem._id, function (err, orgid) {
          if (err) return handleError(err);
          if (orgid) { 
        //Painful parse issue.
        var temp = JSON.parse(JSON.stringify(orgid.entry))
        //Assign
        temp.displayname = req.body.displayname
        temp.description = req.body.description
        temp.location = req.body.location
        temp.url = JSON.stringify(req.body.url)
        temp.email = req.body.email
        orgid.entry = temp    
        orgid.save(function(err,doc) {
          req.flash('success', { msg: 'Your profile information has been updated.' });
          res.redirect('/organizations/'+req.params.orgname+'/settings/profile');
      });
    } else {
        req.flash('error', { msg: 'Something went wrong here.' });
        res.redirect('/organizations/'+req.params.orgname+'/settings/profile');
    }
});
    })
};


///////////////////////////////////////////
//////////  ORGINIZATION LIST ////////////
/////////////////////////////////////////
exports.orglist = function(req, res) {
  if (req.user) {
    if (req.user.permission=="superadmin") {
      organizationalModel.find(  function(err, username) {
        res.render('orginizationlist',{
          username : username
        });
      });
    } else {
     res.redirect('/signin');
   }  
 } else {
   res.redirect('/signin');
 }
};