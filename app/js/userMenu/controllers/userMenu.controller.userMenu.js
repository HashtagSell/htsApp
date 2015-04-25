/**
 * Created by braddavis on 10/17/14.
 */
//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('userMenu', ['$scope', 'Session', 'authModalFactory', '$modal', 'newPostFactory', function ($scope, Session, authModalFactory, $modal, newPostFactory) {

    $scope.userObj = Session.userObj;

    $scope.logout = function () {

        Session.destroy();

    };

    $scope.signIn = function (size) {

        authModalFactory.signInModal();

    };


    $scope.signUp = function (size) {

        authModalFactory.signUpModal();
    };


    $scope.checkEmail = function (size) {

        authModalFactory.checkEmailModal();

    };


    $scope.forgotPassword = function (size) {

        authModalFactory.forgotPasswordModal();
    };



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