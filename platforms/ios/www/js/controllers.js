var counter = 1;

angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, dishes, baseURL) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    
    //var favs = $localStorage.getObject('favoriteslist','[]');
    //favoriteFactory.setFavorites(favs);
    //console.log('AppCtrl favs'+favs);
    
  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo', '{}');
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    $localStorage.storeObject('userinfo', $scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
    

     // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  };
    
    $scope.registration = {};
    
    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        console.log('Doing reservation', $scope.reservation);

        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
    
    
    $ionicPlatform.ready(function() {
        
        if(typeof Camera !== 'undefined'){
            
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };
         $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

            $scope.registerform.show();
        };
                
        var options1 = {
           maximumImagesCount: 1,
           width: 100,
           height: 100,
           quality: 50,
            targetWidth: 100,
            targetHeight: 100
          };

        $scope.pickImage = function(){
            $cordovaImagePicker.getPictures(options1).then(function (results) {
                        // Loop through acquired images
                for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);   // Print image URI
                    $scope.registration.imgSrc = results[i];
                }
            }, function(error) {
                console.log('Error: ' + JSON.stringify(error));    // In case of error
            });
            $scope.registerform.show();
        };
            } else{
                $scope.takePicture = function(){
                    console.log("Camera undefined take picture");
                };
                $scope.pickImage = function(){
                    console.log("Camera undefined image gallery");
                };
            }
    });
    
    $scope.dishes = dishes;
    $scope.baseURL = baseURL;
    
    $ionicModal.fromTemplateUrl('templates/search.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.searchform = modal;
    });

    $scope.closeSearch = function () {
        $scope.searchform.hide();
    };

    $scope.search = function () {
        $scope.searchform.show();
    };
    
})

.controller('MenuController', ['$scope', 'dishes', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicActionSheet', '$location', 'favorites', '$localStorage', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function($scope, dishes, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicActionSheet, $location, favorites, $localStorage, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
                
            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            
            $scope.dishes = dishes;
    
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
    
            $scope.addFavorite = function (dish) {
                console.log("index is " + dish._id);
                favoriteFactory.addToFavorites(dish._id);
                $ionicListDelegate.closeOptionButtons();
                $localStorage.storeObject('favoriteslist', favorites);
                                
                $ionicPlatform.ready(function(){
                    counter++;
                    $cordovaLocalNotification.schedule({
                       id: counter,
                        title: "Added Favorite",
                        text: dish.name
                    }).then(function(){
                        console.log('Notification Added Favorite ' + dish.name);
                    },
                    function(){
                        console.log('Failed to add notification');
                    });
                    
                    $cordovaToast
                    .show('Added Favorite '+dish.name,'long','center')
                    .then(function(success){
                        //success
                    },
                    function(error){
                        //error
                    });
                    
                });
            };
            
            $scope.showActionsheet = function(id) {
                $ionicActionSheet.show({
                  buttons: [
                    { text: 'Add To Favorites' },
                    { text: 'More Details' },
                  ],
                  buttonClicked: function(index) {
                    console.log('BUTTON CLICKED', index);
                      if(index === 0){
                          $scope.addFavorite(id);
                      } else if(index === 1){
                          $location.path('app/menu/'+id);
                      }
                    return true;
                  }
                });
              };
    
        }])

        .controller('ContactController', ['$scope', 'baseURL', function($scope, baseURL) {
            
            $scope.baseURL = baseURL;
            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'baseURL', '$ionicPopover', 'favoriteFactory', '$ionicModal', 'favorites', '$localStorage', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function($scope, $stateParams, dish, menuFactory, baseURL, $ionicPopover, favoriteFactory, $ionicModal, favorites, $localStorage, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
            
            $scope.baseURL = baseURL;
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.dish = dish;
            

               $scope.popover = $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
                  scope: $scope
               }).then(function(popover) {
                  $scope.popover = popover;
               });

               $scope.openPopover = function($event) {
                  $scope.popover.show($event);
               };

               $scope.closePopover = function() {
                  $scope.popover.hide();
               };

               //Cleanup the popover when we're done with it!
               $scope.$on('$destroy', function() {
                  $scope.popover.remove();
               });

               // Execute action on hide popover
               $scope.$on('popover.hidden', function() {
                  // Execute action
               });

               // Execute action on remove popover
               $scope.$on('popover.removed', function() {
                  // Execute action
               });
            
            $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index);
                $scope.closePopover();
                $localStorage.storeObject('favoriteslist', favorites);
                
                $ionicPlatform.ready(function(){
                   
                    $cordovaLocalNotification.schedule({
                       id: counter,
                        title: "Added Favorite",
                        text: $scope.dish.name
                    }).then(function(){
                        console.log('Notification Added Favorite '+$scope.dish.name);
                    },
                    function(){
                        console.log('Failed to add notification');
                    });
                    
                    $cordovaToast
                    .show('Added Favorite '+$scope.dish.name,'long','bottom')
                    .then(function(success){
                        //success
                    },
                    function(error){
                        //error
                    });
                    
                });
            };
            
            $scope.addComment = function () {
                $scope.commentform.show();
                $scope.closePopover();
            };
            
            $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
                scope: $scope
              }).then(function(modal) {
                $scope.commentform = modal;
              });

              $scope.closeCommentForm = function() {
                $scope.commentform.hide();
              };
            
            $scope.submitComment = function () {
                console.log('Comment Submitted', $scope.mycomment);
                $scope.mycomment.date = new Date().toISOString();
                $scope.mycomment.rating = parseInt($scope.mycomment.rating);
                console.log($scope.mycomment);
                $scope.dish.comments.push($scope.mycomment);
        menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);       
                $scope.closeCommentForm();         
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            };
            
        }]) 

        .controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicActionSheet', '$location', '$localStorage', '$ionicPlatform', '$cordovaVibration', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicActionSheet, $location, $localStorage, $ionicPlatform, $cordovaVibration) {

            $scope.baseURL = baseURL;
            $scope.shouldShowDelete = false;
            $scope.favorites = [];
            if(favorites.length === 0){
                $scope.favorites = $localStorage.getObject('favoriteslist', '[]');
                favoriteFactory.setFavorites($scope.favorites);
            }else{
                $scope.favorites = favorites;
            }
            $scope.dishes = dishes;
            console.log($scope.dishes, $scope.favorites);
            $scope.showActionsheet = function(id) {
                $ionicActionSheet.show({
                  buttons: [
                    { text: 'More Details' }
                  ],
                  destructiveText: 'Delete',
                  cancelText: 'Cancel',
                  cancel: function() {
                    console.log('CANCELLED');
                  },
                  buttonClicked: function(index) {
                    console.log('BUTTON CLICKED', index);
                      if(index === 0){
                          $location.path('app/menu/'+id);
                      }
                    return true;
                  },
                  destructiveButtonClicked: function() {
                    console.log('DESTRUCT');
                    $scope.deleteFavorite(id);
                    return true;
                  }
                });
              };

            $scope.toggleDelete = function () {
                $scope.shouldShowDelete = !$scope.shouldShowDelete;
                console.log($scope.shouldShowDelete);
            }

            $scope.deleteFavorite = function (index) {
                
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm Delete',
                    template: 'Are you sure you want to delete this item?'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        console.log('Ok to delete');
                        favoriteFactory.deleteFromFavorites(index);
                        $localStorage.storeObject('favoriteslist', $scope.favorites);
                        
                        $ionicPlatform.ready(function(){
                            $cordovaVibration.vibrate(100);
                        });
                        
                    } else {
                        console.log('Canceled delete');
                    }
                });
                
                $scope.shouldShowDelete = false;
                

            }}])

        // implement the IndexController and About Controller here

        .controller('IndexController', ['$scope', 'featuredDish', 'promotionDish', 'executiveChef', 'baseURL', function($scope, featuredDish, promotionDish, executiveChef, baseURL) {           
                        $scope.baseURL = baseURL;
                        $scope.leader = executiveChef;
                        $scope.dish = featuredDish;
                        $scope.promotion = promotionDish;
            
                    }])

        .controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {
                    $scope.baseURL = baseURL;
                    $scope.leaders = leaders;      
            
                    }])

        .filter('favoriteFilter', function () {
            return function (dishes, favorites) {
                var out = [];
                for (var i = 0; i < favorites.length; i++) {
                    for (var j = 0; j < dishes.length; j++) {
                        if (dishes[j]._id === favorites[i].id)
                            out.push(dishes[j]);
                    }
                }
                return out;

            }})
;
