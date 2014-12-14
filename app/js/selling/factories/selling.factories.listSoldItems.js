/**
 * Created by braddavis on 12/14/14.
 */
/**
 * Created by braddavis on 12/14/14.
 */
htsApp.factory('lookupItemsForSale', ['$http', '$stateParams', '$location', '$q', function($http, $stateParams, $location, $q){

    var factory = {};



    factory.init = function () {

        var deferred = $q.defer();

        var posting_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/getposts";

        $http({method: 'GET', url: posting_api}).
            then(function (response, status, headers, config) {

                console.log('here it is', response);

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };



    return factory;
}]);