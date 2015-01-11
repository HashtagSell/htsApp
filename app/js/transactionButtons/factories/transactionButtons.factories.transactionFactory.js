/**
 * Created by braddavis on 1/10/15.
 */
htsApp.factory('transactionFactory', ['Session', '$modal', '$log', 'authModalFactory', 'quickComposeFactory', 'splashFactory', '$window', '$state', function (Session, $modal, $log, authModalFactory, quickComposeFactory, splashFactory, $window, $state) {

    var transactionFactory = {};

    transactionFactory.quickCompose = function (result) {
        console.log('item we clicked on', result);

        if(Session.userObj.user_settings.email_provider[0].value === "ask") {  //If user needs to pick their email provider

            var modalInstance = $modal.open({
                templateUrl: 'js/transactionButtons/modals/email/partials/transactionButtons.modal.email.partial.html',
                controller: 'quickComposeController',
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

        } else {  //User already set their default email provider

            quickComposeFactory.generateMailTo(Session.userObj.user_settings.email_provider[0].value, result);

        }
    };


    transactionFactory.displayPhone = function (result) {

        var modalInstance = $modal.open({
            templateUrl: 'js/transactionButtons/modals/phone/partials/transactionButtons.modal.phone.partial.html',
            controller: 'phoneModalController',
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

    };

    //CL item does not have phone and email so we open splash detailed view.
    transactionFactory.openSplash = function (result) {
        splashFactory.result = result;
        if($state.is("feed")) {
            $state.go('feed.splash', {id: result.external_id});
        } else if ($state.is("results")) {
            $state.go('results.splash', {id: result.external_id});
        }
    };


    //Ebay item.  Button links to item on ebay
    transactionFactory.placeBid = function (result) {
        $window.open(result.external_url);
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

            authModalFactory.signUpModal();

        }
    };

    return transactionFactory;
}]);