/**
 * Created by braddavis on 5/9/15.
 */
htsApp.controller('paymentController', ['$scope', '$http', '$stateParams', 'ENV', function($scope, $http, $stateParams, ENV) {

    (function(){

        var postingId = $stateParams.postingId;
        var offerId = $stateParams.offerId;

        //Lookup details about the item about to be sold.
        $http.get(ENV.postingAPI + postingId, {
            params: {
                offers: true
            }
        }).success(function (posting){

            $scope.posting = posting;
            //console.log('here is our posting Obj', posting);

            //Lookup seller profile details
            $http.get(ENV.htsAppUrl + '/getProfile', {
                params: {
                    username: posting.username
                }
            }).success(function(sellerProfile){
                $scope.sellerProfile = sellerProfile;
                //console.log('sellers profile', sellerProfile);
            }).error(function(err){
                alert('could not lookup sellers profile.  please inform support');
            });



            //var offerObj = _.where(posting.offers.results, {'offerId': offerId});

            var offerObj;
            for(var i = 0; i < posting.offers.results.length; i++) {

                var offer = posting.offers.results[i];
                console.log(offer.offerId + '===' + offerId);

                if(offer.offerId === offerId){
                    offerObj = posting.offers.results[i];
                    break;
                }
            }



            //console.log('here is our offer obj', offerObj);


            //Lookup buyer profile details
            $http.get(ENV.htsAppUrl + '/getProfile', {
                params: {
                    username: offerObj.username
                }
            }).success(function(buyerProfile){
                $scope.buyerProfile = buyerProfile;
                //console.log('buyersProfile', buyerProfile);
            }).error(function(err){
                alert('could not lookup buyers profile.  please inform support');
            });


        }).error(function (err){
            alert('We could not find your transaction. Please note the url you have been directed to and contact support.  Sorry for inconvenience.');
        });
    })();



    $scope.dropinOptions = {
        paymentMethodNonceReceived: function(e, nonce) {
            e.preventDefault();

            $http.post(ENV.htsAppUrl + '/payments/purchase', {
                postingId: $stateParams.postingId,
                offerId: $stateParams.offerId,
                payment_method_nonce: nonce
            }).success(function (response) {
                if(response.success){
                    if(response.result.success){
                        $scope.alerts.push({ type: 'success', msg: 'Your payment has been sent!  Thanks for using HashtagSell!' });
                    } else {

                        var reloadURL = "/payment/" + $stateParams.postingId + "/" + $stateParams.offerId;
                        $scope.alerts.push({ type: 'danger', msg: response.result.message + ". <a href=" + reloadURL + " target='_self'>Try Again?</a>" });

                    }
                }
            }).error(function (err) {
                $scope.alerts.push({ type: 'danger', msg: err.message });
            });
        }
    };

    $scope.alerts = [];

}]);