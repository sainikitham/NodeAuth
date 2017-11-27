// DB connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeauth', { useMongoClient: true });
var db = mongoose.connection;

// Use bcrypt-nodejs module for password hashing
var bcrypt = require('bcrypt');
// Create User schema
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profileimage: {
    type: String
  }
});

// Create User object using UserSchema model
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
};

// Export create user function
module.exports.createUser = function(newUser, callback) {
  // Use bcrypt-nodejs module to hash password
  bcrypt.hash(newUser.password, 10, function(err, hash) {
    if(err) throw err;
    newUser.password = hash;
    // Create user
    newUser.save(callback);
  });
};
