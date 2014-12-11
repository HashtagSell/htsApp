/**
 * Created by braddavis on 12/10/14.
 */
htsApp.factory('authModalFactory', ['Session', '$modal', '$log', function (Session, $modal, $log) {

    var factory = {};

    // =====================================
    // Spawns Sign In Modal ================
    // =====================================
    factory.signInModal = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/signInModal/partials/signIn.html',
            controller: 'signInModalController'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            console.log(reason);
            if(reason == "signUp"){
                factory.signUpModal();
            } else if (reason == "forgot"){
                factory.forgotPasswordModal();
            }
            $log.info('Modal dismissed at: ' + new Date());
        });
    };





    // =====================================
    // Spawns Sign Up Modal ================
    // =====================================
    factory.signUpModal = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/signUpModal/partials/signUp.html',
            controller: 'signupModalContainer'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason == "success"){
                $scope.checkEmail();
            }
            $log.info('Modal dismissed at: ' + new Date());
        });
    };




    // =====================================
    // Informs user to check email after password reset ================
    // =====================================
    factory.checkEmailModal = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/checkEmailModal/partials/checkEmail.html',
            controller: 'checkEmailController'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };



    // =====================================
    // Spawns Forgot Password Modal ================
    // =====================================
    factory.forgotPasswordModal = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/forgotPasswordModal/partials/forgotPassword.html',
            controller: 'forgotPasswordController'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason == "success"){
                factory.checkEmailModal();
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

    };


    // =====================================
    // User can change their password in settings once they're logged in ================
    // =====================================
    factory.updatePasswordModal = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/updatePasswordModal/partials/updatePassword.html',
            controller: 'updatePasswordModalController'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            console.log(reason);

            $log.info('Modal dismissed at: ' + new Date());
        });

    };


    return factory;
}]);