require('marko/node-require').install();
express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');

module.exports = function(app, config) {
  app.set('/views', config.root + '/app/views');
  app.set('view engine', 'marko');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use('/components', express.static(__dirname + '/components'));
  app.use(methodOverride());

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  var templatePath404 = require.resolve('./../app/views/404.marko'),
    page404 = require('marko').load(templatePath404),
    templatePath500 = require.resolve('./../app/views/500.marko'),
    page500 = require('marko').load(templatePath500);

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    page404.render({
            message: err.message,
            error: err
        },res);
    //next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res) {
      res.status(err.status || 500);
        page404.render({
            message: err.message,
            error: err
        },res);
    });
  }

  app.use(function (err, req, res) {
    res.status(err.status || 500);
    page500.render({
      message: err.message,
      error: {}
    },res);
  });

};
