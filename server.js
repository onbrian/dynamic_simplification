// server.js
// load the express framework
var express = require('express');

// load native Node module "path", which exposes a join method
// that allows us to chain together variables to create a file path
var path = require('path');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
// map the EJS template engine to “.html” files:
app.engine('html', require('ejs').renderFile);

// use /public as static asset directory
app.use(express.static(path.join(__dirname, '/public')));

// use /public/views as default directory for views
app.set('views', path.join(__dirname, 'public', 'views'));

// use res.render to load up an ejs view file

// load main page
app.get('/demo', function(req, res) {
    res.render('demo.html');
});


// load main page
app.get('/zoomDemo', function(req, res) {
    res.render('zoomDemo.html');
});

// load main page
app.get('/baselineDemo', function(req, res) {
    res.render('baselineDemo.html');
});


/*
// give csv
app.get('/RTP_data_csv', function(req, res){
	var fs = require('fs');
    var html = fs.readFileSync('public/csv/RTP.csv');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});

// give geojson
app.get('/multiline_geojson', function(req, res){
    var fs = require('fs');
    var html = fs.readFileSync('public/geojson/multiline_test.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});
*/

app.listen(8080);
console.log('8080 is the magic port');
