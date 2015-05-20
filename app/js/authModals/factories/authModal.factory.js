/**
 * Created by braddavis on 12/10/14.
 */
htsApp.factory('authModalFactory', ['Session', '$modal', '$log', '$state', function (Session, $modal, $log, $state) {

    var factory = {};

    // =====================================
    // Spawns Sign In Modal ================
    // =====================================
    factory.signInModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: '/js/authModals/modals/signInModal/partials/signIn.html',
            controller: 'signInModalController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                params: function(){
                    return params;
                }
            }
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            console.log(reason);
            if(reason === "signUp") {
                $state.go('signup', {'redirect': params.redirect});
            } else if (reason === "forgot") {
                $state.go('forgot', {'redirect': params.redirect});
            } else if (reason === "signIn") {
                $state.go('signin', {'redirect': params.redirect});
            } else if (reason === "successful login" && params.redirect) {
                $state.go(params.redirect);
            }  else if (reason === "successful login" && !params.redirect) {
                $state.go('feed');
            }
            $log.info('Modal dismissed at: ' + new Date());
        });
    };





    // =====================================
    // Spawns Sign Up Modal ================
    // =====================================
    factory.signUpModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: '/js/authModals/modals/signUpModal/partials/signUp.html',
            controller: 'signupModalContainer',
            size: 'sm',
            keyboard: false,
            backdrop: 'static'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason === "success"){
                $state.go('checkemail');
            } else if (reason === "forgot") {
                $state.go('forgot', {'redirect': params.redirect});
            } else if (reason === "signIn") {
                $state.go('signin', {'redirect': params.redirect});
            } else if (reason === "subscribe") {
                $state.go('subscribe', {'redirect': params.redirect});
            }
            $log.info('Modal dismissed at: ' + new Date());
        });
    };




    // =====================================
    // Spawns Early Subscriber Modal =======
    // =====================================
    factory.subscribeModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: '/js/authModals/modals/subscribeModal/partials/subscribe.html',
            controller: 'subscribeModalController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason === "success"){
                $state.go('checkemail');
            } else if (reason === "signUp") {
                $state.go('signup', {'redirect': params.redirect});
            } else if (reason === "signIn") {
                $state.go('signin', {'redirect': params.redirect});
            }
            $log.info('Modal dismissed at: ' + new Date());
        });
    };




    // =====================================
    // Informs user to check email after password reset ================
    // =====================================
    factory.checkEmailModal = function () {

        var modalInstance = $modal.open({
            templateUrl: '/js/authModals/modals/checkEmailModal/partials/checkEmail.html',
            controller: 'checkEmailController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };



    // =====================================
    // Spawns Forgot Password Modal ================
    // =====================================
    factory.forgotPasswordModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: '/js/authModals/modals/forgotPasswordModal/partials/forgotPassword.html',
            controller: 'forgotPasswordController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                params: function () {
                    return params;
                }
            }
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason === "success"){
                $state.go('checkemail');
            } else if (reason === "signUp") {
                $state.go('signup', {'redirect': params.redirect});
            } else if (reason === "signIn") {
                $state.go('signin', {'redirect': params.redirect});
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

    };


    // =====================================
    // User can change their password in settings once they're logged in ================
    // =====================================
    //factory.updatePasswordModal = function () {
    //
    //    var modalInstance = $modal.open({
    //        templateUrl: '/js/authModals/modals/updatePasswordModal/partials/updatePassword.html',
    //        controller: 'updatePasswordModalController',
    //        size: 'sm'
    //    });
    //
    //    modalInstance.result.then(function (reason) {
    //
    //    }, function (reason) {
    //        console.log(reason);
    //
    //        $log.info('Modal dismissed at: ' + new Date());
    //    });
    //
    //};




    // =====================================
    // User can change their if they're not logged in using email recovery token ================
    // =====================================
    factory.resetPasswordModal = function (redirect, token) {

        var modalInstance = $modal.open({
            templateUrl: '/js/authModals/modals/resetPasswordModal/partials/resetPassword.html',
            controller: 'resetPasswordModalController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                token: function () {
                    return token;
                }
            }
        });

        modalInstance.result.then(function (response) {

        }, function (response) {
            console.log(response);
            if(response.success) {
                $state.go('signin', {'redirect': 'feed', email: response.email});
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

    };



    //factory.facebookAuthModal = function () {
    //
    //    var modalInstance = $modal.open({
    //        templateUrl: '/js/authModals/modals/facebookAuthModal/partials/facebookAuth.html',
    //        controller: 'facebookAuthController'
    //    });
    //
    //    modalInstance.result.then(function (reason) {
    //
    //    }, function (reason) {
    //        $log.info('Modal dismissed at: ' + new Date());
    //    });
    //};



    return factory;
}]);