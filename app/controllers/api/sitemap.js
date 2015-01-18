var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  sm = require('sitemap'),
  Post = mongoose.model('Post');

module.exports = function(app) {
  app.use('/', router);
};

router.get('/sitemap.xml', function(req, res, next) {
  Post.prepareSitemap(function(err, posts) {
    sm.createSitemap ({
      urls: posts
    }).toXML(function(xml) {
      res.header('Content-Type', 'application/xml');
      res.send( xml );
    });
  });
});

router.get('/video_sitemap.xml', function(req, res, next) {
  Post.prepareVideoSitemap(function(err, posts) {
    sm.createSitemap ({
      urls: posts
    }).toXML(function(xml) {
      res.header('Content-Type', 'application/xml');
      res.send( xml );
    });
  });
});