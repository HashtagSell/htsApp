/**
 * Created by braddavis on 2/24/15.
 */
htsApp.controller('watchlist.questions.controller', ['$scope', 'qaFactory', '$state', 'Notification', 'myPostsFactory', 'Session', function ($scope, qaFactory, $state, Notification, myPostsFactory, Session) {

    console.log('watchlist.questions.controller');

    $scope.userObj = Session.userObj;

    //Toggles whether the posting owner sees questions they've already answered or not.
    $scope.showAnswered = false;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };


    $scope.deleteQuestion = function (postingId, questionId) {

        console.log(postingId, questionId);

        qaFactory.deleteQuestion(postingId, questionId).then(function (response) {

            if(response.status === 200){

                myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name);

                //$state.go('^');

            } else {

                Notification.error({title: response.name, message: response.message});

            }

        }, function (err) {

            //TODO: Alert status update

        });

    };

}]);