angular.module('PhotoViewerCtrl',[])

.controller('PhotoViewerController', ['$scope', '$http', 'PhotoService', 'PhotoURLService',
  function PhotoViewerCtrl($scope, $http, PhotoService, PhotoURLService) {

    //expose photos to template:
    //$scope.photos = photos;

    // initialize on page 1 and get pagination details.
    $http.get(options.server_url + '/api/photos?pageNum=1')
      .then(function(data, status, headers){
        $scope.pagination = {
          current_page: data['data']['photos']['page'],
          total_pages: data['data']['photos']['pages']
        };
        //set up first items
        $scope.items = data['data']['photos']['photo'];
      });

    // Define a method to load a page of data
    var load = function(page) {
      var isTerminal = $scope.pagination &&
                       $scope.pagination.current_page >= $scope.pagination.total_pages &&
                       $scope.pagination.current_page <= 1;

      console.log('terminal? ' + isTerminal);

      // Determine if there is a need to load a new page
      if (!isTerminal) {
        // Flag loading as started
        $scope.loading = true;

        // Make an API request
       $http.get(options.server_url + '/api/photos?pageNum=' + page)
          .then(function(data, status, headers) {
            console.log('got next page: ' + page)
            // Parse pagination data from the response header
            $scope.pagination.current_page = page;

            // Create an array if not already created
            $scope.items = $scope.items || [];

            // Append new items (or prepend if loading previous pages)
            $scope.items.push.apply($scope.items, data['data']['photos']['photo']);
          })
          .then(function() {
            // Flag loading as complete
            $scope.loading = false;
          })
      }

    }

    // Register event handler
    $scope.$on('endlessScroll:next', function() {
      //console.log('page: ' + $scope.pagination.current_page)
      // Load page
      load($scope.pagination.current_page + 1);
    });

    $scope.getPhotoSourceObject = function(imageObj){
      return {
        urlDefault: PhotoURLService.getDefault(imageObj),
        urlLarge:  PhotoURLService.getLarge(imageObj)
      }
    }
  }
])

.factory('PhotoURLService', function () {
  //  Formats:
  //  https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
  //  or
  //  https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
  //  or
  //  https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)
  //var sampleImgObj = { "id": "11738172576", "owner": "12218676@N04", "secret": "37d0aeb353", "server": "3803", "farm": 4, "title": "_IGP1164", "ispublic": 1, "isfriend": 0, "isfamily": 0 };
  //(500px)   urlDefault = https://farm4.staticflickr.com/3803/11738172576_37d0aeb353.jpg
  //(1024px)  urlLarge = https://farm4.staticflickr.com/3803/11738172576_37d0aeb353_b.jpg

  return {
      getLarge: function(imageObj) {
          return 'https://farm' + imageObj.farm + '.staticflickr.com/' + imageObj.server + '/' + imageObj.id + '_' + imageObj.secret + '_b.jpg';
      },
      getDefault: function(imageObj){
          return 'https://farm' + imageObj.farm + '.staticflickr.com/' + imageObj.server + '/' + imageObj.id + '_' + imageObj.secret + '.jpg';
      }
  }
})

.factory('PhotoService', function ($http) {
    return {
        get: function() {
            return $http.get(options.server_url + '/api/photos');
        }
    }
})
