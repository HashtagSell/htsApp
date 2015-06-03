/**
 * Created by braddavis on 5/10/15.
 */
/**
 * Created by braddavis on 5/9/15.
 */
htsApp.controller('peerReviewController', ['$scope', '$http', '$stateParams', 'ENV', function($scope, $http, $stateParams, ENV) {

    (function(){

        var postingId = $stateParams.postingId;
        var offerId = $stateParams.offerId;
        var userId = $stateParams.userId;

        $scope.reviewForm = {
            rating: 0,
            comment: null
        };

        //Lookup reviewee profile details
        $http.get(ENV.htsAppUrl + '/getProfile', {
            params: {
                userId: userId
            }
        }).success(function(revieweeProfile){
            $scope.reviewee = revieweeProfile;
            console.log('revieweeProfile profile', revieweeProfile);
        }).error(function(err){
            alert('could not lookup reviewees profile.  please inform support');
        });
    })();


    $scope.alerts = [];
}]);