
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
var forms;
 

var forms = mongoose.Schema({
'name' :{ type: String, default: 'Inital Form' },
'detail' :String,
'objectType' :String,				//child type will be a form id , used for determining what component is created by the form.
'childType' :String,				//Used for the routing of new posts
'route' :String,
'entry' :Schema.Types.Mixed,
'collectionName':String,
'parentid' :String,
'name' :String,
'visibility' : String,				//Defines if this is publicly visibile
'userowner':String,					//The username the owner.
'organizationowner':String,			//The organization name of the owner.
'organizations' :String,			//permissions for edit / read access
'users' :String,					//permissions for edit / read access
'elementID' :{ type: String, default: '' },
'userID' :String,					//Oringial creator by user ID , will be good for tracing and error fallback
'revision' :{ type: String, default: 'created' },
'created' : { type: Date, default: Date.now },
'active' : { type: String, default: "true" },
}, { collection: 'forms' });


module.exports = forms = mongoose.model('forms', forms);


 