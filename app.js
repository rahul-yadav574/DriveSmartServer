
var routes = require('./routes/index');
var sendmessage = require('./routes/sendmessage');
var socketsserver = require('./routes/chatserver');
var express = require('express');

var app = express();
require('./utils/config')(app);

app.use('/', routes);
app.use('/sendmessage', sendmessage);
app.use('/sockets',socketsserver);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
