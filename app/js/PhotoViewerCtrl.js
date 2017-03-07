angular.module('PhotoViewerCtrl',[])

.controller("PhotoViewerController", function($scope, PhotoService) {
    $scope.photos = ["Milk", "Bread", "Cheese"];
})

.factory('PhotoService', function ($http) {
    return {
        get: function() {
            return $http.get(options.api.base_url + '/api/photos');
        }
    }
});
