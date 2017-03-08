var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser');
var config = require('./config/config');

//Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

//set custom server-side headers
app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost');
  // res.set('Access-Control-Allow-Credentials', true);
  // res.set('Access-Control-Allow-Methods', 'GET');
  // res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

  //if api_key has been configured in the server, send along to downstream scope
  //req.api_config = config.api_config ? config.api_config : undefined;

  //onward
  next();
});

//Routes
var routes = {};
routes.photos = require('./app/routes/photos.js');

//assign route to handler
app.get('/api/photos', routes.photos.getPhotos);

//catch-all
app.get('/', function(req,res){
  res.redirect('/');
});


// load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

if (appEnv.services['cloudantNoSQLDB']) {
  // Load the Cloudant library.
  var Cloudant = require('cloudant');

  // Initialize database with credentials
  var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);

  //database name
  var dbName = 'mydb';

  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if(!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);
  });

  // Specify the database we are going to use (mydb)...
  mydb = cloudant.db.use(dbName);
}


//set up server
var port = process.env.PORT || 3000
var server = app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

//useful for mocha to close servers when done
exports.closeServer = function(){
  server.close();
};
