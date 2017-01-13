
var siteName = 'Heavy-lifting'


exports.admin = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
         userid = req.user.id
switch (true){
  case(userid=='586b5bbe935a6d19040c5447'):
    res.render('admin', {
      title: 'Admin Panel',
      siteName : siteName,
      layout: false,
    });
  break;
  default:
    res.render('admin', {
      title: 'Home',
      siteName : siteName,
      layout: false,
    });
  break;
}
       } else {
         res.render('home', {
      title: 'Home',
      siteName : siteName,
      layout: false,
    });
       }
};

//Create an entry
exports.create = function(req, res) {

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