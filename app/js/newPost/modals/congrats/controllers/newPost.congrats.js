/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('newPostCongrats', ['$scope', '$modal', '$modalInstance', function ($scope, $modal, $modalInstance) {

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);