// User model

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
  avatar: String,
  twitter: String,
  stack: String,
  name: String,
  linkedin: String,
  google: String,
  bitbucket: String,
  bio: String,
  username: String
});

mongoose.model('User', UserSchema);