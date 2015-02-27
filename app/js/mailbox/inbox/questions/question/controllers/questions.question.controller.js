/**
 * Created by braddavis on 2/24/15.
 */
htsApp.controller('question.questions.controller', ['$scope', '$stateParams', 'mailboxFactory', 'Session', 'qaFactory', '$state', function ($scope, $stateParams, mailboxFactory, Session, qaFactory, $state) {

    $scope.mail = mailboxFactory.mail;

    console.log($scope.mail.quickCache);

    if($scope.mail.quickCache.postingId === $stateParams.postingId && $scope.mail.quickCache.questionId ===  $stateParams.questionId) {
        $scope.question = $scope.mail.quickCache;
    } else {

        qaFactory.getSingleQuestion($stateParams.postingId, $stateParams.questionId).then(function (response) {

            $scope.question = response.data;

        }, function (err) {

            alert('could not lookup question');

        });

    }

    $scope.submitAnswer = function () {

        var postingId = $scope.question.postingId;
        var questionId = $scope.question.questionId;
        var answerPayload = {
            username: $scope.question.username,
            value: $scope.question.givenAnswer
        };

        console.log(postingId);
        console.log(questionId);
        console.log(answerPayload);

        qaFactory.submitAnswer(postingId, questionId, answerPayload).then(function (response) {

            $state.go('^');

        }, function (err) {

            //TODO: Alert status update

        });

    };


    $scope.deleteQuestion = function () {

        var postingId = $scope.question.postingId;
        var questionId = $scope.question.questionId;

        qaFactory.deleteQuestion(postingId, questionId).then(function (response) {

            $state.go('^');

        }, function (err) {

            //TODO: Alert status update

        });

    };

    $scope.updateAnswer = function (answerId) {
        $scope.deleteAnswer(answerId);
        $scope.submitAnswer();
    };

    $scope.deleteAnswer = function (answerId) {

        var postingId = $scope.question.postingId;
        var questionId = $scope.question.questionId;

        qaFactory.deleteAnswer(postingId, questionId, answerId).then(function (response) {

            $state.go('^');

        }, function (err) {

            //TODO: Alert status update

        });
    }

}]);