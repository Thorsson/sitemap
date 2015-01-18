var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'sitemaps'
    },
    port: 4000,
    db: 'mongodb://localhost/sitemaps-development'

  },

  test: {
    root: rootPath,
    app: {
      name: 'sitemaps'
    },
    port: 4000,
    db: 'mongodb://localhost/sitemaps-test'

  },

  production: {
    root: rootPath,
    app: {
      name: 'sitemaps'
    },
    port: 4000,
    db: 'mongodb://localhost/sitemaps-production'

  }
};

module.exports = config[env];
