/**
 * Created by braddavis on 10/17/14.
 */
//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('userMenu', ['$scope', 'Session', 'authModalFactory', '$modal', 'newPostFactory', function ($scope, Session, authModalFactory, $modal, newPostFactory) {

    $scope.userObj = Session.userObj;

    $scope.logout = function () {

        Session.destroy();

    };


    $scope.newPost = function () {

        var modalInstance = $modal.open({
            templateUrl: '/js/newPost/modals/newPost/partials/newpost.html',
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