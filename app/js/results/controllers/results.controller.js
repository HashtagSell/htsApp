htsApp.controller('results.controller', ['$scope', '$sce', '$state', '$timeout', 'searchFactory', 'splashFactory', 'favesFactory', function($scope, $sce, $state, $timeout, searchFactory, splashFactory, favesFactory){

    $scope.imgLoadedEvents = {

        always: function(instance) {

        },

        done: function(instance) {
            $scope.$emit('iso-method', {name:'reLayout', params:null});

            //TODO: don't relayout all items on page.  Only do each item. https://github.com/mankindsoftware/angular-isotope/issues/27
            //$scope.$emit('iso-method', {name:'layout', params:instance.elements[0]});

        },

        fail: function(instance) {
            console.log("Img didn't load?");
        }

    };

    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        console.log(splashFactory.result);
        $state.go('results.splash', { id: elems.result.external_id });
    };

    $scope.rangeSlider = {
        min: 0,
        max: 100,
        step: 1,
        rangeValue : [2,20]
    };

    //Adds $ before the price slider values
    $scope.myFormater = function(value) {
        return "$"+value;
    };

    //Tracks state of map visible or not
    $scope.showMap = 0;

    $scope.reLayout = function(){
        $timeout(function(){
            $scope.$emit('iso-method', {name:'reLayout', params:null});
        }, 1);

    };

    //Tracks state of grid visible or not
    $scope.gridView = true;

    //Tracks state of page if items are currently being loaded into view
    $scope.loading = false;

    $scope.results = [];

    $scope.count = 0;

    $scope.paginate = function(){

        console.log($scope.count++);

        if ($scope.loading) return;

        $scope.loading = true;

        searchFactory.query().then(function (response) {

            if(response.status !== 200) {

                $scope.results = response.data.error;

            } else if(response.status == 200) {

                $scope.results = $scope.results.concat(response.data.merged.postings);

                if(response.data.merged.next_page == 0){ //If next_page equal to zero then we have no more results to display

                    //TODO: Use modal service to notify users
                    alert("no more results");

                    $scope.noMoreResults = true;

                    alert("No more results.");

                    //dialogs.notify('Something Happened!','Something happened that I need to tell you.');

                }

            }

            $timeout(function(){
                if(!$scope.noMoreResults) {
                    $scope.loading = false;
                }
            }, 1000);


        }, function () {

            console.log(response);

            //TODO: Use modal service to notify users
            alert("search error");

        });

    };

    $scope.initQuery = function() {
        searchFactory.queryParams = {}; //Clear params from previous search if any
        $scope.paginate();
    };
    $scope.initQuery(); //Kick off first query

}]);


htsApp.factory('searchFactory', ['$http', '$stateParams', '$location', '$q', '$log', function($http, $stateParams, $location, $q, $log){

    var factory = {};

    factory.query = function(){

        var deferred = $q.defer();

        var search_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/search?q=" + $stateParams.q;

        //TODO: Check if next_page param equal to 0.  this indicates no more results.

        if(factory.queryParams.anchor) {
            search_api += "&anchor=" + factory.queryParams.anchor + "&next_page=" + factory.queryParams.next_page + "&next_tier=" + factory.queryParams.next_tier;
        }

        $log.info(search_api);

        $http({method: 'GET', url: search_api}).
            then(function (response, status, headers, config) {

                console.log(response);

                    factory.queryParams.anchor = response.data.merged.anchor;
                    factory.queryParams.next_page = response.data.merged.next_page;
                    factory.queryParams.next_tier = response.data.merged.next_tier;

                    deferred.resolve(response);

            },
            function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };

    return factory;
}]);


htsApp.directive('htsFaveToggle', function(){
    return {
        restrict: 'E',
        template: '<button type="button" ng-click="toggleFave(result); $event.stopPropagation();" class="btn btn-default" ng-class="{starHighlighted: favorited, star: !favorited}"><i class="fa fa-star"></i></button>',
        controller: ['$scope', '$element', 'favesFactory', function ($scope, $element, favesFactory) {

            favesFactory.checkFave($scope.result, function (response) {
                $scope.favorited = response;
                console.log("done checking");
            });

            $scope.toggleFave = function (item) {
                if (!$scope.favorited) { //If not already favorited
                    favesFactory.addFave(item, function () {  //Add the favorite and flag as done
                        $scope.favorited = !$scope.favorited;
                    });
                } else { //toggle off favorite
                    favesFactory.removeFave(item, function () {
                        $scope.favorited = !$scope.favorited;
                    });
                }
            };
        }]
    };
});