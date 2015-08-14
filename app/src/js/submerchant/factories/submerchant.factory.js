/**
 * Created by braddavis on 5/24/15.
 */
htsApp.factory('subMerchantFactory', ['$q', '$http', '$modal', '$log', 'ENV', 'Session', function ($q, $http, $modal, $log, ENV, Session) {

    var factory = {};

    factory.validateSubMerchant = function (newPost) {

        var deferred = $q.defer();

        var merchantAccount = Session.getSessionValue('merchantAccount');

        console.log('here is merchant account info', merchantAccount);

        if(merchantAccount.response.status === 'active') {

            deferred.resolve(merchantAccount);

        } else { //Sub-merchant account is not active .. open modal and get sub-merchant details.

            var modalInstance = $modal.open({
                templateUrl: 'js/submerchant/modals/partials/submerchant.modal.partial.html',
                controller: function ($scope, $modalInstance, modalConfirmationService) {
                    $scope.close = function () {
                        var modalOptions = {
                            closeButtonText: 'Connect my Venmo',
                            actionButtonText: 'I only accept cash',
                            headerText: 'Accept Cash Only?',
                            bodyText: 'HashtagSell uses Venmo for free online transactions. To accept Venmo payments you need to set up an account.'
                        };

                        modalConfirmationService.showModal({}, modalOptions).then(function (result) {
                            $modalInstance.dismiss('abortSubMerchantModal');
                        });
                    };
                }
            });

            modalInstance.result.then(function (reason, subMerchantResponse) {

            }, function (reason, subMerchantResponse) {
                if(reason === "subMerchantModalSuccess") {
                    console.log('successful merchant setup.  here is response', subMerchantResponse);
                    deferred.resolve(subMerchantResponse);
                } else if (reason === "abortSubMerchantModal"){
                    console.log('use clicked close button');
                    deferred.reject();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });


        }

        return deferred.promise;
    };



    factory.registerPostForOnlinePayment = function (newPost) {

        var deferred = $q.defer();



        return deferred.promise;

    };


    return factory;

}]);