/**
 * Created by braddavis on 4/28/15.
 */
htsApp.controller('feedbackController', ['$scope', 'feedbackFactory', 'Session', function($scope, feedbackFactory, Session) {

    $scope.feedback = feedbackFactory.feedback;

    $scope.userObj = Session.userObj;

    $scope.submitFeedback = function() {
        console.log($scope.feedback);
    };

}]);