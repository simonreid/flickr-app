var config = require('./config.global');

//development specific config goes here

//api configuration
config.api_config = {
  api_key : 'a5e95177da353f58113fd60296e1d250',
  user_id : '24662369@N07', // NASA
  host : 'api.flickr.com',
  path : '/services/rest',
  query_params : {
    nojsoncallback: 1,
    format: 'json',
  }
};

//export
module.exports = config;
