 
var User = require('../../../models/User');
var formsModel      = require('../../../plugins/semini/models/forms.js');
var braintree = require("braintree");

////////////////////////////////////////////
///////   BRAINTREE INTEGRATION    ////////
//////////////////////////////////////////
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANTID,
  publicKey: process.env.PUBLICKEY,
  privateKey: process.env.PRIVATEKEY
});

///////////////////////////////////////////////
////     SET YOUR APP.JSON DETAILS        //// 
/////////////////////////////////////////////
//Not working ? try double dots on the json url..
var myModule = require('../../../app.json');
var sitename = myModule.sitename
var website = myModule.website
var repo = myModule.repo

 
 
 

////////////////////////////////////////
/////  FORMS | CREATE AND VIEW    ///// 
//////////////////////////////////////
exports.issues = function(req, res) {
  //Determine how many forms exist on the server.
  var query1 = formsModel.find().limit(12)
  query1.exec(function (err, results) {
    if(err){console.log('Error Here'); return;}
      var ids = results[10]._id
      var Formids = results[3]._id
      res.render('../../../plugins/wrasse/views/issues', {
      pagetitle: 'Issues | '+sitename ,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
})
}; 


