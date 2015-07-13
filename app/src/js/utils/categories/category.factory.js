/**
 * Created by braddavis on 5/1/15.
 */

//Gets all the categories from groupings api
htsApp.factory('categoryFactory', ['$http', '$q', 'ENV', function ($http, $q, ENV) {
    var factory = {};

    factory.lookupCategories = function () {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.groupingsAPI
        }).then(function (response, status, headers, config) {

            console.log('reference api response', response);

            deferred.resolve(response);

        }, function (response, status, headers, config) {

            deferred.reject(response);
        });

        return deferred.promise;
    };


    return factory;
}]);