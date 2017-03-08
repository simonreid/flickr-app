angular.module('PhotoViewerCtrl',[])

//lodash
.constant('_', window._)

//service to track all pending xhr requests.
//created in order to enable cancelation (really resolving all unresolved promises) of xhr.
.service('pendingRequests', function() {
  var pending = [];
  this.get = function() {
    return pending;
  };
  this.add = function(request) {
    pending.push(request);
  };
  this.remove = function(request) {
    pending = _.filter(pending, function(p) {
      return p.url !== request;
    });
  };
  this.cancelAll = function() {
    angular.forEach(pending, function(p) {
      p.canceller.resolve();
    });
    pending.length = 0;
  };
})

//http request wrapper to facilitate tracking of requests
.service('httpService', ['$http', '$q', 'pendingRequests', function($http, $q, pendingRequests) {
  this.get = function(url) {
    var canceller = $q.defer();
    pendingRequests.add({
      url: url,
      canceller: canceller
    });
    var requestPromise = $http.get(url, { timeout: canceller.promise });
    //remove from pending list if complete
    requestPromise.finally(function() {
      pendingRequests.remove(url);
    });
    return requestPromise;
  }
}])

.controller('PhotoViewerController', ['$scope', '$http', '$q', '_', 'PhotoURLService', 'httpService', 'pendingRequests',
  function PhotoViewerCtrl($scope, $http, $q, _ , PhotoURLService, httpService, pendingRequests) {
    //controls spinner and enable/disable of search/sort functions
    $scope.loading = true;

    //set up variable to track sort value
    $scope.sorter = '';

    //variable to track modal image data-toggle
    $scope.modalData = {};

    var cancelAll = function() {
      pendingRequests.cancelAll();
    }

    $scope.setSort = function(sortString) {
      $scope.sorter = sortString;
    }

    // initialize on page 1 and get pagination details, using get service
    httpService.get(options.server_url + '/api/photos?pageNum=1')
    .then(function(data, status, headers){
      $scope.pagination = {
        current_page: data['data']['photos']['page'],
        total_pages: data['data']['photos']['pages']
      };

      //set up first items
      $scope.items = data['data']['photos']['photo'];
      $scope.loading = false;

      //do additional xhr for additional items beyond page 1
      getMoreItems(1);
    });

    //get additional items if user is doing a search- facilitates getting complete results from all images
    var getMoreItems = function(curPage){
      $scope.moreItems = [];

      if(curPage == 1){
        //go get rest of image pages lazily
        for (var i = 2; i <= $scope.pagination.total_pages; i++){
          httpService.get(options.server_url + '/api/photos?pageNum=' + i)
            .then(function(data, status, headers){
              var newPhotos = data['data']['photos']['photo'];
              $scope.moreItems = $scope.moreItems.concat(newPhotos);
            });
        }
      } else {
        //page is in the middle of a pack
        //get remaining pages
        for (var i = curPage + 1; i <= $scope.pagination.total_pages; i++){
          httpService.get(options.server_url + '/api/photos?pageNum=' + i)
            .then(function(data, status, headers){
              var newPhotos = data['data']['photos']['photo'];
              $scope.moreItems = $scope.moreItems.concat(newPhotos);
            })
        }
        //go get first pages
        for (var i = 1; i <= curPage; i++){
          httpService.get(options.server_url + '/api/photos?pageNum=' + i)
            .then(function(data, status, headers){
              var newPhotos = data['data']['photos']['photo'];
              $scope.moreItems = $scope.moreItems.concat(newPhotos);
            });
        }
      }
    }

    //tool for getting random page number for randomize function
    function randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    //get random page of images
    $scope.randomize = function(){
      $scope.loading = true;
      cancelAll();
      $scope.items = [];
      var newPage = randomIntFromInterval(1, $scope.pagination.total_pages);
      httpService.get(options.server_url + '/api/photos?pageNum=' + newPage)
        .then(function(data, status, headers){
          $scope.pagination = {
            current_page: data['data']['photos']['page'],
            total_pages: data['data']['photos']['pages']
          };
          $scope.items = data['data']['photos']['photo'];
          $scope.loading = false;
        })
        .then(function(){
          getMoreItems(newPage);
        })
    }

    //called when user opens a photo modal; assists with passing data into modal
    $scope.openPhoto = function(photo){
      $scope.modalData = {
        header: photo.title,
        body: photo.description._content,
        dateTaken: (photo.datetaken ? photo.datetaken : "Unknown"),
        views: photo.views,
        image: $scope.getPhotoSourceObject(photo).urlLarge,
        imageurl: $scope.getPhotoSourceObject(photo).urlOriginal
      }
    }

    /* todo: implement infinite scroll
    // Register event handler in case we ever need endless scroll
    $scope.$on('scroll:next', function() {
      //console.log('page: ' + $scope.pagination.current_page)
      // Load page
      //load($scope.pagination.current_page + 1);
    });
    */

    //container for various source urls of a photo
    $scope.getPhotoSourceObject = function(imageObj){
      return {
        urlSquare: PhotoURLService.getSquare(imageObj),
        urlSmall: PhotoURLService.getSmall(imageObj),
        urlLarge:  PhotoURLService.getLarge(imageObj),
        urlOriginal:  PhotoURLService.getOriginal(imageObj)
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

  /*
  s	small square 75x75
  q	large square 150x150
  t	thumbnail, 100 on longest side
  m	small, 240 on longest side
  n	small, 320 on longest side
  -	medium, 500 on longest side
  z	medium 640, 640 on longest side
  c	medium 800, 800 on longest side†
  b	large, 1024 on longest side*
  h	large 1600, 1600 on longest side†
  k	large 2048, 2048 on longest side†
  o	original image, either a jpg, gif or png, depending on source format
  */
  //default "fallback" image is defined here
  var defaultImage = function(imageObj){
    return imageObj.url_n;
  }

  return {
      getOriginal: function(imageObj) {
        if(imageObj.url_o){ return imageObj.url_o} else { return defaultImage(imageObj) };
      },
      getLarge: function(imageObj) {
        if(imageObj.url_l){ return imageObj.url_l} else { return defaultImage(imageObj) };
      },
      getSmall: function(imageObj){
        if(imageObj.url_s){ return imageObj.url_s} else { return defaultImage(imageObj) };
      },
      getSquare: function(imageObj){
        if(imageObj.url_sq){ return imageObj.url_sq} else { return defaultImage(imageObj) };
      }
  }
})

.controller('modalController', ['$scope', function ($scope) {
    $scope.header = $scope.modalData.header;
    $scope.modalBody = $scope.modalData.body;
    $scope.dateTaken = $scope.modalData.dateTaken;
    $scope.views = $scope.modalData.views;
    $scope.modalImage = $scope.modalData.image;
    $scope.modalImageURL = $scope.modalData.imageurl;
}])

//custom directive for modal; uses template found in the /tmpl folder
.directive('modal', function () {
    return {
        restrict: 'EA',
        scope: {
            title: '=modalTitle',
            header: '=modalHeader',
            body: '=modalBody',
            dateTaken: '=modalDateTaken',
            views: '=modalViews',
            image: '=modalImage',
            imageurl: '=modalOrig',
            callbackbuttonleft: '&ngClickLeftButton',
            callbackbuttonright: '&ngClickRightButton',
            handler: '=lolo'
        },
        templateUrl: 'tmpl/modal.tmpl.html',
        transclude: true,
        controller: function ($scope) {
            $scope.handler = 'pop';
        },
    };
});
