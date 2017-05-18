var nodemailer = require('nodemailer');
var recaptcha = require('express-recaptcha');
recaptcha.init('6Ld74SEUAAAAAEk-ZDWZbVw6Bcvb8zQQxgT4Tyqr', '6Ld74SEUAAAAADgWL3K4DpWylpJgyqb3qGXcEvpu');

var transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD
  }
});

/**
 * GET /contact
 */
exports.contactGet = function(req, res) {
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 */
exports.contactPost = function(req, res) {
 
   recaptcha.verify(req, function(error){
        if(!error){

  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('message', 'Message cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/contact');
  }

  var mailOptions = {
    from: req.body.name + ' ' + '<'+ req.body.email + '>',
    to: 'contact@isithelo.com',
    subject: '✔ Contact Form | Heavy-lifting',
    text: req.body.message
  };

  transporter.sendMail(mailOptions, function(err) {
    req.flash('success', { msg: 'Thank you! Your feedback has been submitted.' });
    res.redirect('/contact');
  });

        }
            //success code 
        else{
          req.flash('error', { msg: ' Heads up!  You may very well be a robot!' });
          return res.redirect('/contact');
        }
            //error code 
    })





};
