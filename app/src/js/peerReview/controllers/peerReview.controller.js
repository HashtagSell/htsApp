/**
 * Created by braddavis on 5/10/15.
 */
/**
 * Created by braddavis on 5/9/15.
 */
htsApp.controller('peerReviewController', ['$scope', '$http', '$stateParams', 'ENV', function($scope, $http, $stateParams, ENV) {

    (function(){

        var offerId = $stateParams.offerId;
        var userId = $stateParams.userId;

        $scope.reviewForm = {
            isBuyer: null,
            username: null,
            transactionId: null,
            rating: 0,
            comment: null
        };

        //Lookup transaction details
        $http.get(ENV.transactionsAPI + offerId).success(function(transaction){
            $scope.transaction = transaction;
            console.log('transaction', transaction);

            if(transaction.seller.id) {
                if (transaction.seller.id === userId) {
                    $scope.reviewee = transaction.seller;
                    $scope.reviewForm.isBuyer = false;
                    $scope.reviewForm.username = transaction.sellerUsername;
                    $scope.reviewForm.transactionId = transaction.transactionId;
                } else {
                    $scope.reviewee = transaction.buyer;
                    $scope.reviewForm.isBuyer = true;
                    $scope.reviewForm.username = transaction.buyerUsername;
                    $scope.reviewForm.transactionId = transaction.transactionId;
                }
            } else if(transaction.buyer.id) {
                if(transaction.buyer.id === userId) {
                    $scope.reviewee = transaction.buyer;
                    $scope.reviewForm.isBuyer = true;
                    $scope.reviewForm.username = transaction.buyerUsername;
                    $scope.reviewForm.transactionId = transaction.transactionId;
                } else {
                    $scope.reviewee = transaction.seller;
                    $scope.reviewForm.isBuyer = false;
                    $scope.reviewForm.username = transaction.sellerUsername;
                    $scope.reviewForm.transactionId = transaction.transactionId;
                }
            }

        }).error(function(err){
            alert('could not lookup transaction profile.  please inform support');
        });
    })();


    $scope.alerts = [];

    $scope.submitReview = function () {

        console.log($scope.reviewForm);

        //Submit Review details
        $http.post(ENV.reviewsAPI, $scope.reviewForm).success(function(review){

            console.log(review);
            $scope.alerts.push(
                { type: 'success', msg: 'Wooo hoo! Thanks for using HashtagSell.' }
            );

        }).error(function(err){

            console.log(err);

            $scope.alerts.push(
                { type: 'error', msg: err }
            );
        });

    };
}]);