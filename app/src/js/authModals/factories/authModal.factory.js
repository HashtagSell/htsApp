/**
 * Created by braddavis on 12/10/14.
 */
htsApp.factory('authModalFactory', ['Session', '$modal', '$log', '$state', '$rootScope', function (Session, $modal, $log, $state, $rootScope) {

    var factory = {};

    // =====================================
    // Spawns Sign In Modal ================
    // =====================================
    factory.signInModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/signInModal/partials/signIn.html',
            controller: 'signInModalController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            backdropClass: 'translucent-modal-backdrop',
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
                //$state.go('signup', {'redirect': params.redirect});
                factory.signUpModal(params);
            } else if (reason === "forgot") {
                //$state.go('forgot', {'redirect': params.redirect});
                factory.forgotPasswordModal(params);
            } else if (reason === "signIn") {
                //$state.go('signin', {'redirect': params.redirect});
                factory.signInModal(params);
            } else if (reason === "successful login" && params.redirect) {
                $state.go(params.redirect);
            }  else if (reason === "successful login" && !params.redirect) {
                $state.go('feed');
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });

    };





    // ==========================================================
    // Asks user if they have access code or not ================
    // ==========================================================
    factory.betaCheckModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/betaCheckModal/partials/betaCheck.html',
            controller: 'betaCheckModalController',
            size: 'lg',
            keyboard: false,
            backdrop: 'static',
            backdropClass: 'translucent-modal-backdrop'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if (reason === "signUp") {
                //$state.go('signup', {'redirect': params.redirect});
                factory.signUpModal(params);
            } else if (reason === "subscribe") {
                factory.subscribeModal(params);
                //$state.go('subscribe', {'redirect': params.redirect});
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });
    };





    // =====================================
    // Spawns Sign Up Modal ================
    // =====================================
    factory.signUpModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/signUpModal/partials/signUp.html',
            controller: 'signupModalController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            backdropClass: 'translucent-modal-backdrop'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason === "success"){
                //$state.go('checkemail');
                factory.checkEmailModal(params);
            } else if (reason === "forgot") {
                //$state.go('forgot', {'redirect': params.redirect});
                factory.forgotPasswordModal(params);
            } else if (reason === "signIn") {
                //$state.go('signin', {'redirect': params.redirect});
                factory.signInModal(params);
            } else if (reason === "subscribe") {
                //$state.go('subscribe', {'redirect': params.redirect});
                factory.subscribeModal(params);
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });
    };




    // =====================================
    // Spawns Early Subscriber Modal =======
    // =====================================
    factory.subscribeModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/subscribeModal/partials/subscribe.html',
            controller: 'subscribeModalController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            backdropClass: 'translucent-modal-backdrop'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason === "success"){
                //$state.go('checkemail');
                factory.checkEmailModal(params);
            } else if (reason === "signUp") {
                //$state.go('signup', {'redirect': params.redirect});
                factory.signUpModal(params);
            } else if (reason === "signIn") {
                //$state.go('signin', {'redirect': params.redirect});
                factory.signInModal(params);
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });
    };




    // =====================================
    // Informs user to check email after password reset ================
    // =====================================
    factory.checkEmailModal = function () {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/checkEmailModal/partials/checkEmail.html',
            controller: 'checkEmailController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            backdropClass: 'translucent-modal-backdrop'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });
    };



    // =====================================
    // Spawns Forgot Password Modal ================
    // =====================================
    factory.forgotPasswordModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/forgotPasswordModal/partials/forgotPassword.html',
            controller: 'forgotPasswordController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            backdropClass: 'translucent-modal-backdrop',
            resolve: {
                params: function () {
                    return params;
                }
            }
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason === "success"){
                //$state.go('checkemail');
                factory.checkEmailModal(params);
            } else if (reason === "signUp") {
                //$state.go('signup', {'redirect': params.redirect});
                factory.signUpModal(params);
            } else if (reason === "signIn") {
                //$state.go('signin', {'redirect': params.redirect});
                factory.signInModal(params);
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });

    };


    // =====================================
    // User can change their password if they're not logged in using email recovery token ================
    // =====================================
    factory.resetPasswordModal = function (redirect, token) {

        var modalInstance = $modal.open({
            templateUrl: 'js/authModals/modals/resetPasswordModal/partials/resetPassword.html',
            controller: 'resetPasswordModalController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            backdropClass: 'translucent-modal-backdrop',
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

        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            modalInstance.dismiss('direct');
        });

    };



    return factory;
}]);