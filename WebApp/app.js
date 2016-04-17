var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var reactViews = require('express-react-views');
var app = express();

app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine());
app.set('views', __dirname + '/build');

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
//Static files
app.use('/img',express.static(path.join(__dirname, '/build/img')));
app.use('/css',express.static(path.join(__dirname, '/build/css')));
app.use('/js',express.static(path.join(__dirname, '/build/js')));
app.use('/libs',express.static(path.join(__dirname, '/build/libs')));
app.use('/fonts',express.static(path.join(__dirname, '/build/fonts')));
app.use('/deps',express.static(path.join(__dirname, '/build/deps')));

var server=app.listen(3000);
console.log('Express server listening at port 3000');

//================== Manage routes ======================
require('./routes')(app,server);





