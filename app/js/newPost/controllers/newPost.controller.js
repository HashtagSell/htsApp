htsApp.controller('newPostController', ['$scope', '$modal', 'newPostFactory', 'Session', function ($scope, $modal, newPostFactory, Session) {

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
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

}]);
