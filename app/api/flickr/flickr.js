var https = require('https');
var qs = require('querystring');

exports.getPublicUserPhotos = function(api_config, page, callback){
  try{
    //set customizable method
    var api_method = 'flickr.people.getPublicPhotos';
    api_config.query_params.method = api_method;
    api_config.query_params.user_id = api_config.user_id;
    api_config.query_params.api_key = api_config.api_key;
    api_config.query_params.page = page;
    api_config.query_params.per_page = api_config.numPerPage;
    api_config.query_params.extras = 'description, license, date_upload, \
    date_taken, owner_name, icon_server, original_format, last_update, geo, \
    tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, \
    url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o';

    var request_options = {
      host: api_config.host,
      port: 443,
      path: api_config.path + '?' + qs.stringify(api_config.query_params),
      method: 'GET',
      accept: 'application/json'
    };

    var req = https.request(request_options, function(response) {
        response.setEncoding('utf8');

        //collect response
        var body = '';

        response.on('data', function (chunk) {
          body += chunk;
        });

        response.on('end', function(){
          //end event emitted; proceed to parse and send response back to requestor.
          var parsed = JSON.parse(body);
          callback(null, parsed);
        });
      });
    req.end();

  } catch (e){
    callback(e, null);
  }
}


//create correctly formatted API url
var getApiUrl = function(user_id, api_key, callback){

}
