var config = require('./config.global');

//development specific config goes here

//mongodb
config.dburl = 'mongodb://dbUser:dbUser@127.0.0.1:27017/test?authMechanism=SCRAM-SHA-1';
config.env = 'development';
//note to self: cannot set user and password in mongoOpts for whatever reason. default auth mechanism if not provided is MONGODB-CR.


//jwt signature secret
config.jwtsecret = 'weeeeee';
config.jwtExpirationSeconds = 60 * 60 * 24; //1 day expiration

config.sessionsecret = 'weeeeee';

//export
module.exports = config;
