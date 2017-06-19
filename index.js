var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var recaptcha = require('express-recaptcha');

// Load environment variables from .env file
dotenv.load();

// Controllers
var initController = require('./controllers/initialize');
var HomeController = require('./controllers/home');
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var adminController = require('./controllers/admin');
var userInterfaceController = require('./controllers/userinterface');
var createController = require('./controllers/create');
var readController = require('./controllers/read');
var deleteController = require('./controllers/delete');
var pagesController = require('./controllers/pages');
var productController = require('./controllers/product');
var assemblyController = require('./controllers/assembly');
var componentController = require('./controllers/component');

//Updated Controllers
///////////////////////////////////////////////////////////////////////////////////
var organizationController = require('./controllers/organization');

// Passport OAuth strategies
require('./config/passport');

var app = express();

//favicon location
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/img//favicon/favicon-16x16.png')); 

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(process.env.MONGODB);
}

mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

var db = mongoose.connection;
db.once('open', function() {
  // we're connected!
  console.log('mongoose connection ok')
  //compile the schema for mongoose
});

var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON : function(object) {
      return JSON.stringify(object);
    },
    partial: function (name) {
      return name;
    },
    'dotdotdot' : function(str) {
      if (str) {
        if (str.length > 16)
          return str.substring(0,16) + '...';
        return str;}
      },
      'dotdotdotdot' : function(str) {

        if (str) {
          if (str.length > 200)
            return str.substring(0,200) + '...';
          return str;
        }
      }
    }
  });




 // Redirect all HTTP traffic to HTTPS
 function ensureSecure(req, res, next){
  if(req.headers["x-forwarded-proto"] === "https"){
  // OK, continue
  return next();
};
res.redirect('https://'+req.hostname+req.url);
};
// Handle environments
if (app.get('env') == 'production') {
  app.all('*', ensureSecure);
}


app.engine('handlebars', hbs.engine);


app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 5000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////
////       PAGES        //// 
///////////////////////////
app.get('/store', pagesController.store);
app.get('/database', pagesController.database);
app.get('/help', pagesController.help);
app.get('/forms', pagesController.forms);
app.get('/assemblies', pagesController.assemblies);
app.get('/configuration', pagesController.configuration);
app.get('/reports', pagesController.reports);


////////////////////////////////////////////
////       INITIALIZE DATABASE         //// 
//////////////////////////////////////////
app.get('/init', initController.deletedb);
app.get('/deletedb', initController.deletedb);
app.get('/getdb', initController.getdb);


//////////////////////////////////////////////////////////////////////
////        PRIMARY ADMINISTRATIVE DATABASE MODIFICATION         //// 
////////////////////////////////////////////////////////////////////
app.get('/hl-admin', adminController.hadmin);
app.get('/admin', adminController.admin);
app.get('/read',  adminController.read);
app.get('/update',  adminController.update);
app.get('/delete',  adminController.delete);

/////////////////////////////////
////        DATABASE        //// 
///////////////////////////////
//Load Template
app.get('/templateload', readController.templateload);


/////////////////////////////////////////
////       CREATE CONTROLLERS       //// 
///////////////////////////////////////
app.post('/create',  createController.create);


///////////////////////////////////////////
////       DELETE CONTROLLERS         //// 
/////////////////////////////////////////
//get data by array of ids.
app.get('/deleteentryperm', deleteController.deleteentryperm);
//get data by array of ids permanently.
app.get('/deleteentry', deleteController.deleteentry);


/////////////////////////////////////////
////       READ CONTROLLERS         //// 
///////////////////////////////////////
//admin page table view.
app.get('/getCollectionData', readController.getCollectionData);

//get data by array of ids.
app.get('/getdata', readController.getdata);
//get data by array of ids.
app.get('/getdatacomp', readController.getdatacomp);
 //get data by parentid
 app.get('/parentid', readController.parentid);
 //get data 
 app.get('/getshortdata', readController.getshortdata);
 //get jstree 
 app.get('/jstree', readController.jstree);
  //get the select ddrop down items
  app.get('/getformfield', readController.getformfield);
  //get the select templatename
  app.get('/templatename', readController.templatename);
  //get the select groups
  app.get('/groups', readController.groups);
//get the navmenu
app.get('/navmenuload', readController.navmenuload);
//get the usermenu
app.get('/loadusermenu', readController.loadusermenu);
//get the loadcompmenu
app.get('/loadcompmenu', readController.loadcompmenu);
//get the single element id
app.get('/singleidcall', readController.singleidcall);
//get the single element id
app.get('/findme', readController.findme);
//get the get assembly all element id
app.get('/getassemblyall', readController.getassemblyall);
//get the get assembly all element id
app.get('/defaultassy', readController.defaultassy);
// getformraw
app.get('/getformraw', readController.getformraw);
// getformraw
app.get('/getcompform', readController.getcompform);


/////////////////////////////////////
////       PRODUCTS             //// 
///////////////////////////////////
// getformraw
app.get('/productload', productController.productload);


/////////////////////////////////////
////       ASSEMBLY             //// 
///////////////////////////////////
app.get('/assembly/new',  assemblyController.newassy);



//search for the form to load.
app.get('/getform',  componentController.additionaldetails , readController.getform);


//Rebuild routing
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////
////       TEMPALTES        //// 
///////////////////////////////
app.get('/privacy', pagesController.privacy);
app.get('/terms', pagesController.terms);

///////////////////////////////////////////////////
////        USER INTERFACE CONTROLLER         //// 
/////////////////////////////////////////////////
app.get('/users/', userInterfaceController.users);
app.get('/users/:username/',componentController.componentforms, componentController.usercomponents,organizationController.userorganizations,componentController.organizationcomponents ,userInterfaceController.profile);
app.get('/users/:username/settings/',userInterfaceController.settings);
app.get('/users/:username/settings/:page', componentController.componentforms,componentController.usercomponents,organizationController.userorganizations,componentController.organizationcomponents , userInterfaceController.page);
app.get('/usersearch', userInterfaceController.usersearch);

/////////////////////////////////////
////       ORGANIZATION         //// 
///////////////////////////////////
//Static
app.get('/organizations', organizationController.orglist);
app.get('/organizations/new', organizationController.neworg);
app.post('/organizations/new', organizationController.createorgstatic);
app.get('/organizations/:orgname/', organizationController.ajaxorguserread ,organizationController.orgprofile);
app.get('/organizations/:orgname/settings',organizationController.ajaxorguserread , organizationController.settings);
app.get('/organizations/:orgname/components', organizationController.ajaxorguserread ,organizationController.components);
app.get('/organizations/:orgname/assemblies',organizationController.ajaxorguserread , organizationController.assemblies);
app.get('/organizations/:orgname/people', organizationController.ajaxorguserread ,organizationController.people);
app.get('/organizations/:orgname/settings',organizationController.ajaxorguserread , organizationController.settings);
app.get('/organizations/:orgname/settings/:page', organizationController.ajaxorguserread , organizationController.page);
app.put('/organizations/:orgname', userController.ensureAuthenticated, organizationController.orgPut);

//Ajax
app.get('/orguserread', organizationController.orguserread); // Get the active user organizations , owner and member.


///////////////////////////////////
////       COMPONENTS         //// 
/////////////////////////////////
app.get('/components/', componentController.components);
app.get('/componentssuperadmin/', componentController.componentssuperadmin);




app.get('/component/new', organizationController.ajaxorguserread , componentController.componentforms, componentController.newcomp);

//User Components
app.get('/components/users/', componentController.usersview);
app.get('/components/users/:username/', componentController.users);
app.get('/components/users/:username/:compid', componentController.compiduser);
//Organization Components
app.get('/components/organizations/', componentController.organizationsview);
app.get('/components/organizations/:orgname', componentController.organizations);
app.get('/components/organizations/:orgname/:compid', componentController.compidorg);





/////////////////////////////////////
////       EMAILING             //// 
///////////////////////////////////
//Testing of the smtp mail , work great.
app.get('/testmail', userInterfaceController.testmail);




//////////////////////////////////////////DEFAULTS//////////////////////////////////////////

/////////////////////////////////
////       HOME             //// 
///////////////////////////////
app.get('/', HomeController.index);

app.get('/contact', contactController.contactGet);
app.post('/contact', contactController.contactPost);
app.get('/account', userController.ensureAuthenticated, userController.accountGet);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);
app.get('/signin', userController.loginGet);
app.post('/signin', userController.loginPost);
app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);
app.get('/reset/:token', userController.resetGet);
app.post('/reset/:token', userController.resetPost);
app.get('/signout', userController.signout);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/signin' }));
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email profile repo' ] }));
app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/signin' }));


/////////////////////////////
////       404          //// 
///////////////////////////
app.get('*', function(req, res){
  res.render('404',{layout:false});
});


// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});


module.exports = app;
