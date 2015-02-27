htsApp.controller('newPostController', ['$scope', '$modal', 'newPostFactory', 'Session', 'authModalFactory', function ($scope, $modal, newPostFactory, Session, authModalFactory) {

    $scope.userObj = Session.userObj;

    $scope.newPost = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/newPost/modals/newPost/partials/newpost.html',
            controller: 'newPostModal',
            size: 'lg',
            resolve: {
                mentionsFactory: function () {
                    return newPostFactory;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.modalContent.selected = selectedItem;
        }, function (reason) {
            if(reason === "stageOneSuccess"){
                $scope.pushtoExternalService();
            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };



    $scope.pushtoExternalService = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/newPost/modals/pushToExternalSources/partials/newpost.pushToExternalSources.html',
            controller: 'pushNewPostToExternalSources',
            size: 'lg'
        });

        modalInstance.result.then(function (selectedItem) {

        }, function (reason) {
            if(reason === "stageTwoSuccess"){
                $scope.congrats();
            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };




    $scope.congrats = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/newPost/modals/congrats/partials/newPost.congrats.html',
            controller: 'newPostCongrats',
            size: 'lg'
        });

        modalInstance.result.then(function (selectedItem) {

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
