var express = require('express'),
    router = express.Router(),
    templatePath = require.resolve('./../views/book.marko'),
    template = require('marko').load(templatePath);

module.exports = function (app) {
  app.use('/', router);
};

/* GET home page. */
router.get('/books', function(req, res) {
  template.render({
    title : "Library"
  },res);
});

