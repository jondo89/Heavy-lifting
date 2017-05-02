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
var orginizationController = require('./controllers/orginization');
var pagesController = require('./controllers/pages');


// Passport OAuth strategies
require('./config/passport');

var app = express();

//favicon location
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/img//favicon/favicon-16x16.png')); 

mongoose.connect(process.env.MONGODB);
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
        }
    
  }
});




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

app.get('/', HomeController.index);


/////////////////////////////
////       PAGES        //// 
///////////////////////////
app.get('/store', pagesController.store);
app.get('/components', pagesController.components);
app.get('/database', pagesController.database);
app.get('/organization/new', pagesController.neworg);
app.get('/help', pagesController.help);
app.get('/forms', pagesController.forms);
app.get('/assemblies', pagesController.assemblies);
app.get('/configuration', pagesController.configuration);
app.get('/reports', pagesController.reports);

/////////////////////////////////
////       TEMPALTES        //// 
///////////////////////////////
app.get('/privacy', pagesController.privacy);
app.get('/terms', pagesController.terms);

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

///////////////////////////////////////////////////
////        USER INTERFACE CONTROLLER         //// 
/////////////////////////////////////////////////
app.get('/settings',  userInterfaceController.settings);
app.get('/profile', userInterfaceController.profile);
/////////////////////////////////////
////       ORGINIZATION         //// 
///////////////////////////////////
app.get('/orginization',  orginizationController.orginization);
app.get('/orginization/new',  orginizationController.new);

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
//search for the form to load.
app.get('/getform', readController.getform);
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

/* Redundant
//click to open with navmenu
app.get('/pageload', readController.pageload);
*/






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
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email profile repo' ] }));
app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' }));



 



/////////////////////////////
////       404          //// 
///////////////////////////
app.get('*', function(req, res){
  res.render('404');
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
