const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/nodeauth', { useMongoClient: true });
mongoose.Promise = global.Promise;
//schema
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

module.exports.createUser = function(newUser,callback){
  bcrypt.hash(newUser.password,10,function(err,hash) {
    if (err) {
      throw err;
    }
    newUser.password = hash;
    newUser.save(callback);
  });
}
