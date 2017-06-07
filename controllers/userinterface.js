var heavyliftingModel      = require('../models/heavylifting.js');
var organizationalModel      = require('../models/organizations.js');
var User = require('../models/User');
var siteName = 'Heavy-lifting'
var User = require('../models/User');

 ////////////////////////////////////
////////// SETTINGS PAGE ///////////
///////////////////////////////////
exports.settings = function(req, res) {
  if (req.user) {
   userid = req.user.id
   switch (true){
    default:
    heavyliftingModel.find().limit(5).exec(function (err, init) {
      if (err) { return next(err); }
      var ids = '58db2e4f6c196145e853955e'
      var Formids = init[3]._id
      res.render('settings', {
        siteName : siteName,
        items : JSON.stringify(ids),
        Formids : JSON.stringify(Formids)
      });
    });
    break;
  }
} else {
 res.redirect('/signin');
}
};

////////////////////////////////////
////////// PROFILE PAGE ////////////
///////////////////////////////////
exports.profile = function(req, res) {
 //There is a requirement to limit the form size  , as such send the find and send the headings from the parent.
 var query1 = User.findOne(
 {
  "username" : req.params.username
})
 query1.exec(function (err, user) { 
  if(err){console.log('Error Here query1'); return;}
  if (user) {
    var query2 = heavyliftingModel.find(
    {
      userID : user._id
    },
    { created: 1  ,_id:0}
    )
    query2.exec(function (err, calender) { 
      if(err){console.log('Error Here query2'); return;}


  var query3 = organizationalModel.find(
    {$or: [
      {"entry.members": user.username },
      {"entry.owner":  user.username }
      ]}
      )
  query3.exec(function (err, query3_return) {
    if(err){console.log('Error Here'); return;} 

      user.password = 'Kwakwakwa'
      res.render('account/profile', {
        userload : user,
        calender : calender,
        organizations : query3_return
      });
       //Query end

})
     })
  } else {
   res.redirect('/');
 }
 //Query end
})
};

 

//////////////////////////////
//////////  PAGE ////////////
////////////////////////////
exports.page = function(req, res) {
  if (req.user) {
    var template =  req.params.page 
    var username =  req.params.username 
    switch (true){
      case(template=='organizations'):
      var query1 = organizationalModel.find(
        {$or: [
          {"entry.members": username },
          {"entry.owner":  username }
          ]}
        )
      query1.exec(function (err, query1_return) {
        if(err){console.log('Error Here'); return;} 
        console.log(query1_return)
        res.render('settings/'+template,{
          organizations : query1_return
        });
      //Query end
    })
      break;
      default:
      res.render('settings/'+template);
      break;
    }

  } else {
   res.redirect('/signin');
 }
};

//////////////////////////////
//////////  USERS ////////////
////////////////////////////
exports.users = function(req, res) {
  if (req.user) {
    if (req.user.permission=="superadmin") {
      User.find(  function(err, username) {
        res.render('userlist',{
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


////////////////////////////////
//////////  SEARCH ////////////
//////////////////////////////
exports.usersearch = function(req, res) {
  var myExp = new RegExp(req.param('item'), 'i');
      var query1 = User.find({"username" : {$regex : myExp}})
      query1.exec(function (err, query1_return) {
        if(err){
res.send("No user found");
         return;} 
         console.log(query1_return)
                  res.send(
                    { users : query1_return}
                    );
      })
};


///////////////////////////////////
//////////  TEST MAIL ////////////
/////////////////////////////////
exports.testmail = function(req, res) {
 
res.send("Sent");

'use strict';
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  host: ' ',
  port: 587,
  tls: {
    rejectUnauthorized: false
  },
    secure: false, // secure:true for port 465, secure:false for port 587
    auth: {
      user: ' ',
      pass: ' '
    }
  });

// setup email data with unicode symbols
var mailOptions = {
    from: ' ', // sender address
    to: ' ', // list of receivers
    subject: 'Heavy-lifting - Confirm your e-mail', // Subject line
    text: 'Hello world ?', // plain text body
    html: 'SnapScan - Confirm your e-mail' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});

};

