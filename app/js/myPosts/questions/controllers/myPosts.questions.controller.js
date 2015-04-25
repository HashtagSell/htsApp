/**
 * Created by braddavis on 2/24/15.
 */
htsApp.controller('myPosts.questions.controller', ['$scope', 'qaFactory', '$state', 'Notification', 'myPostsFactory', 'Session', function ($scope, qaFactory, $state, Notification, myPostsFactory, Session) {

    $scope.userObj = Session.userObj;

    //Toggles whether the posting owner sees questions they've already answered or not.
    $scope.showAnswered = false;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };



    $scope.submitAnswer = function (question, index) {

        var answerPayload = {
            username: question.username,
            value: question.givenAnswer
        };


        qaFactory.submitAnswer(question.postingId, question.questionId, answerPayload).then(function (response) {

            if(response.status === 201) {

                console.log(response);

                myPostsFactory.getAllUserPosts($scope.userObj.user_settings.name).then(function (response) {

                });

            } else {

                Notification.error({title: response.name, message: response.message});

            }

        }, function (err) {

            //TODO: Alert status update

        });

    };


    $scope.deleteQuestion = function (postingId, questionId, index) {

        qaFactory.deleteQuestion(postingId, questionId).then(function (response) {

            if(response.status === 204){

                $scope.post.questions.results.splice(index, 1);

                if(!$scope.post.questions.results.length) {
                    $state.go('^');
                }

            } else {

                Notification.error({title: response.name, message: response.message});

            }

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

            //$state.go('^');

        }, function (err) {

            //TODO: Alert status update

        });
    };

}]);