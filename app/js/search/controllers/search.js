htsApp.controller('searchController', ['$scope', '$timeout', 'searchFactory', function($scope, $timeout, searchFactory){

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


    $scope.openItem = function(elem) {
        console.log("open item")
    };

    $scope.rangeSlider = {
        min: 0,
        max: 100,
        step: 1,
        rangeValue : [2,20]
    };

    $scope.myFormater = function(value) {
        return "$"+value;
    };

    $scope.showMap = 0;

    $scope.reLayout = function(){
        $timeout(function(){
            $scope.$emit('iso-method', {name:'reLayout', params:null});
        }, 1);

    };

    $scope.gridView = true;

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

            }

            $timeout(function(){
                $scope.loading = false;
            }, 1000);


        }, function () {

            alert("search error");

        });

    };

    $scope.initQuery = function() {
        searchFactory.queryParams = {}; //Clear params from previous search if any
        $scope.paginate();
    };
    $scope.initQuery(); //Kick off first query

}]);


htsApp.factory('searchFactory', ['$http', '$routeParams', '$location', '$q', '$log', function($http, $routeParams, $location, $q, $log){

    var factory = {};

    factory.query = function(){

        var deferred = $q.defer();

        var search_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/search?q=" + $routeParams.q;

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

    return factory
}]);