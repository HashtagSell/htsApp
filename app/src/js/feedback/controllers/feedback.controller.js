/**
 * Created by braddavis on 4/28/15.
 */
htsApp.controller('feedbackController', ['$scope', '$state', '$rootScope', 'feedbackFactory', '$http', 'ENV', 'Notification', 'Session', function($scope, $state, $rootScope, feedbackFactory, $http, ENV, Notification, Session) {

    $scope.feedback = feedbackFactory.feedback;

    $scope.userObj = Session.userObj;

    $scope.showFeedbackForm = function () {
        if($scope.userObj.user_settings.loggedIn) {
            $scope.feedback.form.visible = true;
        } else {
            $state.go('signup', {redirect: $rootScope.currentState});
        }
    };

    $scope.hideFeedbackForm = function () {
        if($scope.userObj.user_settings.loggedIn) {
            $scope.feedback.form.visible = false;
        } else {
            $state.go('signup', {redirect: $rootScope.currentState});
        }
    };

    $scope.submitFeedback = function() {

        $scope.feedback.form.user = $scope.userObj.user_settings.name;

        $http.post(ENV.feedbackAPI, $scope.feedback).success(function(response) {

            if(response.success) {
                $scope.feedback.form.visible = false;
                $scope.feedback.form.generalFeedback = null;
                Notification.primary({
                    title: "Feedback Sent!",
                    message: "You'll receive an email shortly.",
                    delay: 6000
                });
            } else if (response.error) {
                Notification.error({
                    title: "Could not submit your feedback",
                    message: response.error,
                    delay: 10000
                });
            }

        }).error(function(err) {
            Notification.error({
                title: "Could not submit your feedback",
                message: "Sorry! Something is big time wrong. Email us at feedback@hashtagsell.com.",
                delay: 10000
            });
        });
    };

}]);