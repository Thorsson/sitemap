// Always set to test environments
process.env.NODE_ENV = 'test';

var app = require('../app');

var request = require('supertest'),
    expect = require('expect.js'),
    express = require('express'),
    mongoose = require('mongoose'),
    connection = mongoose.connection,
    parse = require('xml-parser'),
    FactoryGirl = require('factory-girl'),
    Factory = new FactoryGirl.Factory(),
    MongooseAdapter = require('factory-girl-mongoose').MongooseAdapter;

var Post = mongoose.model('Post'),
    User = mongoose.model('User');

Factory.setAdapter(MongooseAdapter);

Factory.define('User', User, {
  username: 'tester'
});

Factory.define('Post', Post, {
  meta: {
    title: 'Test title',
    canonical: 'http://www.test.com',
    ogTitle: 'Test title',
    ogImage: 'http://www.test.com/test_image.png',
    ogVideo: 'http://www.test.com/test_player',
    ogUrl: 'http://www.test.com',
    description: 'Sample description'
  },
  updated: Date.now()
});

function XMLresponse(text) {
  return parse(text);
}

function createPost(options) {
  options = options || {};

  var newPost = Factory.create('Post', options, function(err, post) {
    newPost = post;
  });

  return newPost;
}

function clearDatabase() {
  connection.db.dropDatabase(function(err){
    if(err) console.log(err);
  });
}

function getRequest(path, callback) {
  request(app)
    .get(path)
    .expect(200)
    .end(function(err, res) {
      var text = XMLresponse(res.text);

      callback(err, text, res);
    });
}

function requestSitemap(callback) {
  getRequest('/sitemap.xml', callback);
}


function requestVideoSitemap(callback) {
  getRequest('/video_sitemap.xml', callback);
}


describe('Sitemap', function() {
  afterEach(function() {
    clearDatabase();
  });

  it("renders successfully", function() {
    request(app)
      .get('/sitemap.xml')
      .expect(200);
  });

  it("generates empty sitemap", function() {
    requestSitemap(function(err, res) {
      expect(err).to.be(null);
      expect(res.root.children.length).to.be(0);
    });
  });

  it("generates correct sitemap content", function() {
    requestSitemap(function(err, res) {
      expect(err).to.be(null);
      expect(res.declaration).not.to.be(null);
    });
  });

  it("generates a single post", function() {
    var newPost = Factory.create('Post', {}, function(err, post) {
      newPost = post;
    });

    requestSitemap(function(err, res) {
      expect(err).to.be(null);
      expect(res.root.children.length).to.be(1);
    });
  });

  it("generats correctly just the correct posts", function() {
    var newPost = Factory.create('Post', {}, function(err, post) {
      newPost = post;
    });

    requestSitemap(function(err, res) {
      var loc = res.root.children[0].children[0].content;
      expect(loc).to.contain(newPost.meta.ogUrl);
    });
  });
});

describe("Video Sitemap", function() {
  afterEach(function() {
    clearDatabase();
  });

  it("renders successfully", function() {
    request(app)
      .get('/video_sitemap.xml')
      .expect(200);
  });

  it("generates correct sitemap content", function() {
    requestVideoSitemap(function(err, res) {
      expect(err).to.be(null);
      expect(res.declaration).not.to.be(null);
    });
  });

  it("generates empty sitemap", function() {
    requestVideoSitemap(function(err, res) {
      expect(err).to.be(null);
      expect(res.root.children.length).to.be(0);
    });
  });

  it("generates a single post", function() {
    var newPost = Factory.create('Post', {}, function(err, post) {
      newPost = post;
    });

    requestVideoSitemap(function(err, res) {
      expect(err).to.be(null);
      expect(res.root.children.length).to.be(1);

      var loc = res.root.children[0].children[0].content;
      expect(loc).to.contain(newPost.meta.ogUrl);
    });
  });
});