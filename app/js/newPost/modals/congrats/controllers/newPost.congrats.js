/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('newPostCongrats', ['$scope', '$modal', '$modalInstance', 'newPost', function ($scope, $modal, $modalInstance, newPost) {

    $scope.newPost = newPost;

    console.log(newPost);

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);