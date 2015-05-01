htsApp.controller('newPostController', ['$scope', '$modal', 'newPostFactory', 'Session', 'authModalFactory', function ($scope, $modal, newPostFactory, Session, authModalFactory) {

    $scope.userObj = Session.userObj;

    $scope.newPost = function () {

        var modalInstance = $modal.open({
            templateUrl: '/js/newPost/modals/newPost/partials/newPost.html',
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
            if(dismissObj.reason === "stageOneSuccess"){

                $scope.pushtoExternalService(dismissObj.post);
            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };



    $scope.pushtoExternalService = function (post) {

        var modalInstance = $modal.open({
            templateUrl: '/js/newPost/modals/pushToExternalSources/partials/newPost.pushToExternalSources.html',
            controller: 'pushNewPostToExternalSources',
            resolve: {
                newPost : function () {
                    return post;
                }
            }
        });

        modalInstance.result.then(function (dismissObj) {

        }, function (dismissObj) {
            if(dismissObj.reason === "stageTwoSuccess"){
                $scope.congrats(dismissObj);
            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };




    $scope.congrats = function (postingObj) {

        var modalInstance = $modal.open({
            templateUrl: '/js/newPost/modals/congrats/partials/newPost.congrats.html',
            controller: 'newPostCongrats',
            resolve: {
                newPost: function () {
                    return postingObj;
                }
            }
        });

        modalInstance.result.then(function () {

        }, function (reason) {
            if(reason === "dismiss"){
                console.log('Modal dismissed at: ' + new Date());
            }
        });
    };



    $scope.signIn = function (size) {
        authModalFactory.signInModal();

    };


    $scope.signUp = function (size) {
        authModalFactory.signUpModal();
    };

}]);
