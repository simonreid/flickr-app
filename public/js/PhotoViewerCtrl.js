angular.module('PhotoViewerCtrl',[])

.controller('PhotoViewerController', ['$scope', '$http', 'PhotoService', function PhotoViewerCtrl($scope, $http, PhotoService) {
    PhotoService.get().then(function(data){
      var photoData = data.data["photos"];
      var page = photoData["page"];
      var pages = photoData["pages"];
      var perPage = photoData["perpage"];
      var total = photoData["total"];
      var photos = photoData["photo"];

      //expose photos to template:
      $scope.photos = photos;

      $scope.getPhotoSourceObject = function(imageObj){
        //  Formats:
        //  https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
        //  or
        //  https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
        //  or
        //  https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)
        //var sampleImgObj = { "id": "11738172576", "owner": "12218676@N04", "secret": "37d0aeb353", "server": "3803", "farm": 4, "title": "_IGP1164", "ispublic": 1, "isfriend": 0, "isfamily": 0 };

        var urlDefault = 'https://farm' + imageObj.farm + '.staticflickr.com/' + imageObj.server + '/' + imageObj.id + '_' + imageObj.secret + '.jpg';
        var urlLarge = 'https://farm' + imageObj.farm + '.staticflickr.com/' + imageObj.server + '/' + imageObj.id + '_' + imageObj.secret + '_b.jpg';

        //(500px)   urlDefault = https://farm4.staticflickr.com/3803/11738172576_37d0aeb353.jpg
        //(1024px)  urlLarge = https://farm4.staticflickr.com/3803/11738172576_37d0aeb353_b.jpg

        return {
          urlDefault: urlDefault,
          urlLarge: urlLarge
        }
      }
    });
  }
])

.factory('PhotoService', function ($http) {
    return {
        get: function() {
            return $http.get(options.server_url + '/api/photos');
        }
    }
});
