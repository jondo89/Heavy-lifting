
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
var heavylifting;
 

var heavylifting = mongoose.Schema({
'name' :{ type: String, default: 'Inital Form' },
'detail' :String,
'objectType' :String,
//child type will be a form id , used for determining what component is created by the form.
'childType' :String,
'entry' :Schema.Types.Mixed,
'parentid' :String,
'name' :String,
'elementID' :{ type: String, default: '' },
'userID' :String,
'revision' :{ type: String, default: 'created' },
'created' : { type: Date, default: Date.now },
'active' : { type: String, default: "true" },
}, { collection: 'heavylifting' });


module.exports = heavylifting = mongoose.model('heavylifting', heavylifting);


 