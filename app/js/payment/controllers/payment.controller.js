/**
 * Created by braddavis on 5/9/15.
 */
htsApp.controller('paymentController', ['$scope', '$braintree', '$http', '$stateParams', 'ENV', function($scope, $braintree, $http, $stateParams, ENV) {

    //Credit card angular form populates this obj
    $scope.creditCard = {
        cardholderName: null,
        number: null,
        expirationMonth: null,
        expirationYear:  null,
        cvv: null
    };


    var client;

    //When the user clicks a payment method this function is kicked off.
    $scope.selectPaymentMethod = function (paymentType) {


        if(paymentType === 'creditCard'){

            $braintree.getClientToken().success(function(token) {
                client = new $braintree.api.Client({
                    clientToken: token
                });
            });
            $scope.selectedPaymentMethod = paymentType; //This hides all the payment choices and shows the credit card form.

        } else if (paymentType === 'payPal') {

            $scope.selectedPaymentMethod = paymentType; //This hides all the payment choices.. how do I get paypal button to show up?
        }

    };

    //When the user clicks the submit button after entering their credit card credentials this kicks off.
    $scope.runCreditCard = function() {

        // - Validate $scope.creditCard
        // - Make sure client is ready to use

        client.tokenizeCard({
            number: $scope.creditCard.number,
            cardholderName: $scope.creditCard.cardholderName,
            expirationMonth: $scope.creditCard.expirationMonth,
            expirationYear: $scope.creditCard.expirationYear,
            cvv: $scope.creditCard.cvv
        }, function (err, nonce) {

            // - Send nonce to your server (e.g. to make a transaction)
            $http.post(ENV.braintreeAPI + '/purchase', {payment_method_nonce: nonce}).success(function(response){
                console.log(response);
            });

        });
    };
}]);