/**
 * Created by braddavis on 1/10/15.
 */
htsApp.factory('transactionFactory', ['Session', '$modal', '$rootScope', '$log', '$state', 'authModalFactory', 'quickComposeFactory', 'splashFactory', '$window', '$http', '$q', 'ENV', function (Session, $modal, $rootScope, $log, $state, authModalFactory, quickComposeFactory, splashFactory, $window, $http, $q, ENV) {

    var transactionFactory = {};

    //transactionFactory.quickCompose = function (result) {
    //    console.log('item we clicked on', result);
    //
    //    if (!Session.userObj.user_settings.loggedIn) {
    //
    //        $state.go('signup', {redirect: $rootScope.currentState});
    //
    //    } else {
    //
    //        if (Session.userObj.user_settings.email_provider[0].value === "ask") {  //If user needs to pick their email provider
    //
    //            var modalInstance = $modal.open({
    //                templateUrl: 'js/transactionButtons/modals/email/partials/transactionButtons.modal.email.partial.html',
    //                controller: 'quickComposeController',
    //                resolve: {
    //                    result: function () {
    //                        return result;
    //                    }
    //                }
    //            });
    //
    //            modalInstance.result.then(function (reason) {
    //
    //            }, function (reason) {
    //                console.log(reason);
    //                if (reason === "signUp") {
    //                    authModalFactory.signUpModal();
    //                }
    //                $log.info('Modal dismissed at: ' + new Date());
    //            });
    //
    //        } else {  //User already set their default email provider
    //
    //            quickComposeFactory.generateMailTo(Session.userObj.user_settings.email_provider[0].value, result);
    //
    //        }
    //    }
    //
    //};
    //
    //
    //transactionFactory.displayPhone = function (result) {
    //
    //    if (!Session.userObj.user_settings.loggedIn) {
    //
    //        $state.go('signup', {redirect: $rootScope.currentState});
    //
    //    } else {
    //
    //        var modalInstance = $modal.open({
    //            templateUrl: 'js/transactionButtons/modals/phone/partials/transactionButtons.modal.phone.partial.html',
    //            controller: 'phoneModalController',
    //            resolve: {
    //                result: function () {
    //                    return result;
    //                }
    //            }
    //        });
    //
    //        modalInstance.result.then(function (reason) {
    //
    //        }, function (reason) {
    //            console.log(reason);
    //            if (reason === "signUp") {
    //                authModalFactory.signUpModal();
    //            }
    //            $log.info('Modal dismissed at: ' + new Date());
    //        });
    //    }
    //
    //};
    //
    ////CL item does not have phone and email so we open splash detailed view.
    //transactionFactory.openSplash = function (result) {
    //    splashFactory.result = result;
    //    $state.go('results.splash', {id: result.external.source.url});
    //};
    //
    //
    ////Ebay item.  Button links to item on ebay
    //transactionFactory.placeBid = function (result) {
    //
    //    if (!Session.userObj.user_settings.loggedIn) {
    //
    //        $state.go('signup', {redirect: $rootScope.currentState});
    //
    //    } else {
    //
    //        $window.open(result.external.source.url);
    //    }
    //};


    transactionFactory.showOriginal = function (result) {

        if (!Session.userObj.user_settings.loggedIn) {

            $state.go('signup', {redirect: $rootScope.currentState});

        } else {

            $window.open(result.external.source.url);
        }

    };


    //HTS item.  Gathers date and time to propose for pickup.
    transactionFactory.placeOffer = function (result) {
        if(Session.userObj.user_settings.loggedIn) {  //If user logged In

            var modalInstance = $modal.open({
                templateUrl: 'js/transactionButtons/modals/placeOffer/partials/transactionButtons.modal.placeOffer.partial.html',
                controller: 'placeOfferController',
                resolve: {
                    result: function () {
                        return result;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if (reason === "signUp") {
                    authModalFactory.signUpModal();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });

        } else {  //User is not logged in.

            $state.go('signup', {redirect: $rootScope.currentState});

        }
    };


    //HTS item.  Gathers price and location to propose for pickup.
    transactionFactory.proposeDeal = function (result, offerIndex) {
        if(Session.userObj.user_settings.loggedIn) {  //If user logged In

            var modalInstance = $modal.open({
                templateUrl: 'js/transactionButtons/modals/proposeDeal/partials/transactionButtons.modal.proposeDeal.partial.html',
                controller: 'proposeDealController',
                resolve: {
                    result: function () {
                        return result;
                    },
                    offerIndex: function () {
                        return offerIndex;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if (reason === "signUp") {
                    authModalFactory.signUpModal();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });

        } else {  //User is not logged in.

            $state.go('signup', {redirect: $rootScope.currentState});

        }
    };



    transactionFactory.buyNow = function(result) {

        if(!Session.userObj.user_settings.loggedIn) {

            $state.go('signup', {redirect: $rootScope.currentState});

        } else {

            var modalInstance = $modal.open({
                templateUrl: 'js/transactionButtons/modals/buyNow/partials/transactionButtons.modal.buyNow.partial.html',
                controller: 'buyNowModalController',
                resolve: {
                    result: function () {
                        return result;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if(reason === 'venmo'){

                    var venmoUrl = "https://venmo.com/?txn=pay&recipients=" + result.user.merchantAccount.details.funding.email + "&amount=" + result.askingPrice.value + "&note=" + result.heading + "&audience=private";
                    $window.open(venmoUrl);

                } else if (reason === 'meetingRequest') {

                    console.log('closing modal');

                    //transactionFactory.placeOffer(result);
                    transactionFactory.proposeDeal(result);

                }
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    };



    transactionFactory.createTransaction = function (newTransactionRequirements) {

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.transactionsAPI,
            data: newTransactionRequirements
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };

    return transactionFactory;
}]);