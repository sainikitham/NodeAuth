var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// File upload handler
var multer = require('multer');
var upload = multer({dest: './uploads'});

/*
 *  This is the /users route.
 */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// User registration page route
router.get('/register', function(req, res, next) {
  res.render('register', {
    'title': 'Register'
  });
});

// User login page route
router.get('/login', function(req, res, next) {
  res.render('login', {
    'title': 'Login'
  });
});

router.post('/register', upload.single('profileimage'), function(req, res, next){
  //Get form values
  var name        = req.body.name;
  var email       = req.body.email;
  var username    = req.body.username;
  var password    = req.body.password;
  var password2   = req.body.password2;

  // Check for profile image field
  if (req.file) {
    console.log('Uploading file...');
    console.log(req.file);
    // Set profile picture file info
    var profileImageOriginalName  = req.file.originalname;
    var profileImageName          = req.file.originalname;
    var profileImageMime          = req.file.mimetype;
    var profileImagePath          = req.file.path;
    var profileImageExt           = req.file.extension;
    var profileImageSize          = req.file.size;
  } else {
    // Set a default image
    var profileImageName = 'noimage.png';
    console.log(profileImageName);
  }

  // Express-validator form validation check
  req.checkBody('name', 'Name field is required.').notEmpty();
  req.checkBody('email', 'Email field is required.').notEmpty();
  req.checkBody('email', 'Email is not valid.').isEmail();
  req.checkBody('username', 'Username field is required.').notEmpty();
  req.checkBody('password', 'Password field is required.').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

  // Check for form errors
  var errors = req.validationErrors();

  if (errors) {
    // Errors found
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  } else {
    // No errors found
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileImageName
    });

    // Create user
    User.createUser(newUser, function(err, user) {
      if (err) throw err;
    });

    // Success message
    req.flash('success', 'You are now registered and may log in.');
    res.location('/');
    res.redirect('/');
  }
});

// router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login',
//                                                         failureFlash:"invalid username or password."}),function(req,res){
//                 console.log("authentication successfull");
//                 res.flash("success","you are logged in..");
//                 res.redirect('/');
//             });
module.exports = router;
