'use strict';
/**
 * @ngdoc overview
 * @name flickr-app
 * @description
 * # flickr-app
 *
 * Main module of the application.
 */
 var options = {};
 options.server_url = "http://flickr-app.mybluemix.net";

 angular.module('flickr-app',
 [
 'PhotoViewerCtrl',
 'dc.endlessScroll'
 ]);
