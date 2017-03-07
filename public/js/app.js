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
 options.server_url = "http://localhost:3000";

 angular.module('flickr-app',
 [
 'PhotoViewerCtrl',
 'dc.endlessScroll'
 ]);
