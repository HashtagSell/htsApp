/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('pushNewPostToExternalSources', ['$scope', '$modal', '$modalInstance', 'externalSourcesSelection', 'newPost', '$http', 'ENV', function ($scope, $modal, $modalInstance, externalSourcesSelection, newPost, $http, ENV) {


    //Passes the newPost object with the selected external sources to the Josh's api.  Upon success passes resulting post obj to congrats.
    $scope.dismiss = function (reason) {

        if($scope.sourceSelections.length) {

            for (var i = 0; i < $scope.sourceSelections.length; i++) {

                var externalSource = $scope.sourceSelections[i];


                if (externalSource === "eBay") {

                    var payload = {
                        "ebay": true
                    };

                    //TODO: Push to ebay
                    $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).
                        success(function (response) {
                            var eBayResponse = response;
                            console.log("-----Push to eBay Complete----");
                            console.log(eBayResponse);
                            $modalInstance.dismiss({reason: reason, post: newPost, eBayResponse: eBayResponse});
                        });
                }
            }
        } else {

            $modalInstance.dismiss({reason: reason, post: newPost});

        }
    };

    $scope.sources = externalSourcesSelection.sources;

    $scope.sourceSelections = [];

    // watch fruits for changes
    $scope.$watch('sources.marketplaces|filter:{selected:true}', function (newValue) {

        $scope.sourceSelections = newValue.map(function (source) {
            return source.name;
        });

    }, true);


}]);