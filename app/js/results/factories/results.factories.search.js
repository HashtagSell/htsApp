/**
 * Created by braddavis on 12/14/14.
 */
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