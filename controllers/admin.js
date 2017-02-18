var heavyliftingModel      = require('../models/heavylifting.js');
var siteName = 'Heavy-lifting'


exports.hadmin = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
 userid = req.user.id
 switch (true){
  case(userid == '586b5bbe935a6d19040c5447' || userid == '5878b000d1f7c0220c1d2903'):
  res.render('hl-admin', {
    title: 'Database Admin',
    siteName : siteName,
    layout: false,
  });
  break;
  default:
  res.redirect('/dashboard');
  break;
}
} else {
 res.redirect('/signin');
}
};


exports.admin = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
 userid = req.user.id
 switch (true){
  case(userid == '586b5bbe935a6d19040c5447' || userid == '5878b000d1f7c0220c1d2903'):
  heavyliftingModel.find().limit(5).exec(function (err, init) {
    if (err) { return next(err); }
    var ids = init[4]._id
    var Formids = init[3]._id
    res.render('admin', {
      title: 'Database Admin',
      siteName : siteName,
      layout: false,
      items : JSON.stringify(ids),
      Formids : JSON.stringify(Formids)
    });
  });
  break;
  default:
  res.redirect('/database');
  break;
}
} else {
 res.redirect('/signin');
}
};


//Create an entry
exports.create = function(req, res) {
  if (req.user) {
    userid = req.user.id
//admin 1
//'586b5bbe935a6d19040c5447'
//admin 2
//'5878b000d1f7c0220c1d2903'
if (userid == '586b5bbe935a6d19040c5447' | userid == '5878b000d1f7c0220c1d2903') {
  console.log('this is retunred client side.',req.body)
  var create = new heavyliftingModel(req.body);  
  create.save(function (err, doc) {  
    if (err) {
      res.send(err);
    } else{
      res.redirect('/')
    }
  });
}
} else {
 userid=''
 res.redirect('/login');
}
};





//read an entry
exports.read = function(req, res) {
 
};

//update an entry
exports.update = function(req, res) {

 
};
//delete an entry
exports.delete = function(req, res) {
 
};