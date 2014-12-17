/**
 * Created by braddavis on 12/15/14.
 */
htsApp.controller('feed.controller', ['$scope', 'feedFactory', 'splashFactory', '$state', '$interval', function ($scope, feedFactory, splashFactory, $state, $interval) {

    feedFactory.queryParams = {};

    var updateFeed = function(){

        feedFactory.poll().then(function (response) {

            if(response.status !== 200) {

                $scope.results = response.data.error;

            } else if (response.status === 200) {


                if(response.data.external.postings.length > 0) { //If we have at least one result
                    if (!$scope.results) { //If there are not results on the page yet, put them on page
                        $scope.results = response.data.external.postings;
                    } else { //If there are already results on the page the add them to the top of the array

                        console.log('our new items', response.data.external.postings);

                        for(i = 0; i < response.data.external.postings.length; i++){
                            $scope.results.unshift(response.data.external.postings[i]);
                        }

                    }
                }

            }
        }, function (response) {

            console.log(response);

            //TODO: Use modal service to notify users
            alert("polling error");

        });
    };
    updateFeed();


    var intervalUpdate = $interval(updateFeed, 30000, 0, true);
    $scope.$on('$destroy', function () { $interval.cancel(intervalUpdate); });



    $scope.scrollRefresh = function () {
      updateFeed();
    };


    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        console.log(splashFactory.result);
        $state.go('feed.splash', { id: elems.result.external_id });
    };


}]);