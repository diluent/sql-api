var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
//var api = require('./api.js');
var apiSql = require('./apiSql.js');

var port = process.env.PORT || 8080;
var router = express.Router(); 

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use('/static', express.static(path.join(__dirname, 'AppBrowserBuild')));

var appRouter = express.Router();
var apiRouter = express.Router();

apiSql(apiRouter);

appRouter.get('/test', function(req, res) {
    res.sendFile(__dirname + '/Test.html');
});

app.use(function(req, res, next) {
  console.log(`${req.method}: ${req.url}`)
  next();
});

app.use('/', appRouter);
app.use('/api', apiRouter);
app.get('*', function(req, res) {
    res.json({'route': 'Sorry this page does not exist!'});
});


app.listen(port);

console.log('...running at https://localhost:' + port);