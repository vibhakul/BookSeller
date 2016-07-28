var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'yo-bookseller'
    },
    port: 5000,
    db: 'mongodb://test:test123@ds023425.mlab.com:23425/yo-bookseller-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'yo-bookseller'
    },
    port: 5000,
    db: 'mongodb://test:test123@ds023425.mlab.com:23425/yo-bookseller-development'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'yo-bookseller'
    },
    port: 5000,
    db: 'mongodb://test:test123@ds023425.mlab.com:23425/yo-bookseller-development'
    
  }
};

module.exports = config[env];
