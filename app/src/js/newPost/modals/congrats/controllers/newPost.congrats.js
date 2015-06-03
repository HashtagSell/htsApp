/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('newPostCongrats', ['$scope', '$modal', '$modalInstance', 'newPost', 'myPostsFactory', 'Session', 'socketio', function ($scope, $modal, $modalInstance, newPost, myPostsFactory, Session, socketio) {

    $scope.newPost = newPost;

    console.log(newPost);

    myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name).then(function () {

        for(var i = 0; i < myPostsFactory.userPosts.data.length; i++){

            var post = myPostsFactory.userPosts.data[i];

            socketio.joinPostingRoom(post.postingId, 'postingOwner'); //Join the room of each posting the user owns.

        }
    });

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);