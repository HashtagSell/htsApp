/**
 * Created by braddavis on 10/17/14.
 */
//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('userMenu', ['$scope', 'Session', 'authModalFactory', function ($scope, Session, authModalFactory) {

    $scope.userObj = Session.userObj;

    console.log('userMenu sees', $scope.userObj);

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


}]);