 
var userModel = require('../../../models/User');
var formModel = require('../models/forms');
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
exports.forms = function(req, res) {
  //Determine how many forms exist on the server.
  var query1 = formModel.find().limit(6)
  query1.exec(function (err, results) {
    if(err){console.log('Error Here'); return;}
    if (results.length >=6) {
      var ids = results[4]._id
      var Formids = results[3]._id
      var ids = results[4]._id
      var Formids = results[3]._id
     res.render('../../../plugins/semini/views/forms', {
      pagetitle: 'Forms | '+sitename ,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
   } else {
    res.render('create',{
      pagetitle: 'create | '+sitename+'',
      forms : results,
      formsparse : JSON.stringify(results),
    })
  }
})
}; 

 