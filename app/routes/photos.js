var flickr = require('../api/flickr/flickr');
var config = require('../../config/config');

exports.getPhotos = function(req,res) {
  //use api configuration to make request to api
  if(config.api_config){
    flickr.getPublicUserPhotos(config.api_config, function(err, result){
      if(!err){
        res.status(200).send(result);
      } else {
        res.status(400).send(err);
      }
    });
  } else {
    res.status(402).send('API configuration missing.');
  }
}
