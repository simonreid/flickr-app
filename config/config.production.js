var config = require('./config.global');

//production specific config goes here
config.env = 'production';
module.exports = config;
