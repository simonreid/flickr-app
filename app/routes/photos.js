var flickr = require('../api/flickr/flickr');
var config = require('../../config/config');

exports.getPhotos = function(req,res) {
  //use api configuration to make request to api
  if(config.api_config && req.query.pageNum){
    if(config.offline == 1){
      res.status(200).send(config.offlineResponse);
    } else {
      flickr.getPublicUserPhotos(config.api_config, req.query.pageNum, function(err, result){
        if(!err){
          res.status(200).send(result);
        } else {
          res.status(400).send(err);
        }
      });
    }
  } else {
    res.status(400).send('Missing config or pageNum parameter.');
  }
}
