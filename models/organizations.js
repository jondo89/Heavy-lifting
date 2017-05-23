
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
var organizations;
 

var organizations = mongoose.Schema({
'name' :{ type: String, default: 'Inital Form' },
'detail' :String,
'objectType' :String,
//child type will be a form id , used for determining what component is created by the form.
'childType' :String,
//Used for the routing of new posts
'route' :String,
'entry' :Schema.Types.Mixed,
'parentid' :String,
'name' :String,
'elementID' :{ type: String, default: '' },
'userID' :String,
'revision' :{ type: String, default: 'created' },
'created' : { type: Date, default: Date.now },
'active' : { type: String, default: "true" },
}, { collection: 'organizations' });


module.exports = organizations = mongoose.model('organizations', organizations);


 