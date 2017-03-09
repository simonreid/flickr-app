var config = module.exports = {};
//default port, if not overridden
config.serverPort = 3000;

//offline response, in case of connection issues
config.offlineResponse = require('./offline_response.json');
config.offline = false;
