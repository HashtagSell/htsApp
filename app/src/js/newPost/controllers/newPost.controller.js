htsApp.controller('newPostController', ['$scope', '$modal', '$state', 'newPostFactory', 'Session', 'authModalFactory', 'myPostsFactory', function ($scope, $modal, $state, newPostFactory, Session, authModalFactory, myPostsFactory) {

    $scope.userObj = Session.userObj;

    $scope.newPost = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/newPost/modals/newPost/partials/newPost.html',
            controller: 'newPostModal',
            size: 'lg',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                mentionsFactory: function () {
                    return newPostFactory;
                }
            }
        });

        modalInstance.result.then(function (dismissObj) {

        }, function (dismissObj) {
            if (dismissObj.reason === "stageOneSuccess") {

                $scope.pushtoExternalService(dismissObj.post);
            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };



    $scope.pushtoExternalService = function (post) {

        var modalInstance = $modal.open({
            templateUrl: 'js/newPost/modals/pushToExternalSources/partials/newPost.pushToExternalSources.html',
            controller: 'pushNewPostToExternalSources',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                newPost : function () {
                    return post;
                }
            }
        });

        modalInstance.result.then(function (dismissObj) {

        }, function (dismissObj) {
            if(dismissObj.reason === "stageTwoSuccess"){
                myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, meeting requests, etc etc.  The owner app view updates realtime.
                    $state.go('myposts');
                });
            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };




    //$scope.congrats = function (postingObj) {
    //
    //    var modalInstance = $modal.open({
    //        templateUrl: 'js/newPost/modals/congrats/partials/newPost.congrats.html',
    //        controller: 'newPostCongrats',
    //        resolve: {
    //            newPost: function () {
    //                return postingObj;
    //            }
    //        }
    //    });
    //
    //    modalInstance.result.then(function () {
    //
    //    }, function (reason) {
    //        if(reason === "dismiss"){
    //            $state.go('myposts');
    //            console.log('Modal dismissed at: ' + new Date());
    //        }
    //    });
    //};

}]);
