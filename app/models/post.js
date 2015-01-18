// Post model

require('./user');
require('./tag');

var mongoose   = require('mongoose'),
    Schema     = mongoose.Schema,
    ObjectId   = Schema.Types.ObjectId,
    o2x = require('object-to-xml'),
    UserSchema = mongoose.model('User').schema,
    TagSchema  = mongoose.model('Tag').schema;

var PostSchema = new Schema({
  assetUrl: String,
  by: { type: ObjectId, ref: 'User' },
  created: { type: Date, default: Date.now },
  md: String,
  meta: {
    title: String,
    canonical: String,
    ogTitle: String,
    ogImage: String,
    ogVideo: String,
    ogUrl: String,
    description: String
  },
  published: Date,
  publishedBy: { type: ObjectId, ref: 'User' },
  slug: String,
  tags: [TagSchema],
  title: String,
  updated: { type: Date, default: Date.now }
});

PostSchema.statics.prepareSitemap = function(callback) {
  var sitemap = [];

  this
    .find()
    .where("meta.canonical").ne(null)
    .select('meta updated')
    .exec(function(err, posts) {
      if(!err) {
        sitemap = posts.map(function(post) {
          return {
            url: post.meta.canonical,
            lastmod: post.updated
          };
        });

        callback(err, sitemap);
      }
  });

  return sitemap;
};

PostSchema.statics.prepareVideoSitemap = function(callback) {
  var sitemap = [];

  this
    .find()
    .where("meta.ogUrl").ne(null)
    .where("meta.ogVideo").ne(null)
    .select('updated meta')
    .exec(function(err, posts) {
      if(!err) {
        sitemap = posts.map(function(post) {
          var meta = post.meta;
          return {
            url: post.meta.ogUrl,
            lastmod: post.updated,
            video: {
              thumbnailLoc: meta.ogImage,
              title: meta.title,
              description: meta.description,
              playerLoc: meta.ogVideo
            }
          };
        });

        callback(err, sitemap);
      }
  });

  return sitemap;
};

mongoose.model('Post', PostSchema);