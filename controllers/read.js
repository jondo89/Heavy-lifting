var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'


exports.getCollectionData = function(req, res) {
var types = req.param('objectType')
var showall = req.param('showall')
var userid
if (req.user) {
                 userid = req.user.id
               } else {
                 userid=''
               }
if (showall == 'true') {
    var query = heavyliftingModel.find(
    {
      "objectType": types ,    
    })
} else {
  var query = heavyliftingModel.find(
  {
    "active": true ,
    "objectType": types , 
  })
}
query.exec(function (err, docs1) {
  if (err) { return next(err); }
    res.send(JSON.stringify(docs1))
  })
};
 