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
            if(reason === "success"){

            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.signIn = function (size) {
        authModalFactory.signInModal();

    };


    $scope.signUp = function (size) {
        authModalFactory.signUpModal();
    };

}]);
