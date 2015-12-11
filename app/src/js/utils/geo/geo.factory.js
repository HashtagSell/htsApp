/**
 * Created by braddavis on 7/9/15.
 */
htsApp.factory('geoFactory', ['$q', '$http', 'ENV', function ($q, $http, ENV) {

    var factory = {};

    factory.geolocateUser = function () {

        var deferred = $q.defer();

        $http.get(ENV.utilsApi + 'geolocate').success(function (response) {

            deferred.resolve(response);

        }).error(function (response) {

            var err = {
                message: 'Whoops.. We can\'t find any results in ' + response.freeGeoIp.city,
                error: response
            };

            deferred.reject(err);
        });


        return deferred.promise;

    };

    return factory;

}]);