/**
 * Created by braddavis on 12/14/14.
 */
/**
 * Created by braddavis on 12/14/14.
 */
htsApp.factory('sellingFactory', ['$http', '$stateParams', '$location', '$q', function($http, $stateParams, $location, $q){

    var factory = {};


    var posting_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/posts";


    factory.init = function () {

        var deferred = $q.defer();

        $http({method: 'GET', url: posting_api}).
            then(function (response, status, headers, config) {

                console.log('here it is', response);

                //factory.cache = response.data;
                //
                //console.log('inside forsalefacory', factory.cache);

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };



    factory.deletePost = function (post) {

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: posting_api,
            params: {
                id: post._id
            }
        }).then(function (response, status, headers, config) {

                console.log('delete response: ', response);

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };



    return factory;
}]);