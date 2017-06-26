var heavyliftingModel      = require('../models/heavylifting.js');
var organizationalModel      = require('../models/organizations.js');
var User = require('../models/User');
var siteName = 'Heavy-lifting'
var User = require('../models/User');



exports.index = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
    res.render('splash', {
      organizations : req.organizations,
      organizationsParse:req.organizationsParse,
      userorgcomplist:req.userorgcomplist,
      userorgcomplistParse:req.userorgcomplistParse,
      componentlist : req.componentlist,
      componentlistParse : req.componentlistParse,
      componentlistall : req.componentlistall,
      componentlistParseall : req.componentlistParseall,
      items:req.items, //list of all heavy-lifting DB entires
      itemsParse:req.itemsParse,//list of all heavy-lifting DB entires
      title: req.user.username + ' | Heavy-lifting' ,
    });
} else {
  res.render('home', {
    title: 'Heavy-lifting',
    siteName : siteName,
    layout: false
  });
}
};
