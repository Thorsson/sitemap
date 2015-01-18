// Tag model

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var TagSchema = new Schema({
  name: String,
  slug: String
});

mongoose.model('Tag', TagSchema);