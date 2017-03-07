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


//var mydb;

/* Endpoint to greet and add a new visitor to database.
* Send a POST request to localhost:3000/api/visitors with body
* {
* 	"name": "Bob"
* }
*/
//app.post("/api/visitors", function (request, response) {
//  var userName = request.body.name;
//  if(!mydb) {
//    console.log("No database.");
//    response.send("Hello " + userName + "!");
//    return;
//  }
//  // insert the username as a document
//  mydb.insert({ "name" : userName }, function(err, body, header) {
//    if (err) {
//      return console.log('[mydb.insert] ', err.message);
//    }
//    response.send("Hello " + userName + "! I added you to the database.");
//  });
//});

/**
 * Endpoint to get a JSON array of all the visitors in the database
 * REST API example:
 * <code>
 * GET http://localhost:3000/api/visitors
 * </code>
 *
 * Response:
 * [ "Bob", "Jane" ]
 * @return An array of all the visitor names
 */
/*
app.get("/api/visitors", function (request, response) {
  var names = [];
  if(!mydb) {
    response.json(names);
    return;
  }

  mydb.list({ include_docs: true }, function(err, body) {
    if (!err) {
      body.rows.forEach(function(row) {
        if(row.doc.name)
          names.push(row.doc.name);
      });
      response.json(names);
    }
  });
});
*/

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

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));



//set up server
var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
