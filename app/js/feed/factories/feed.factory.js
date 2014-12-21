/**
 * Created by braddavis on 12/15/14.
 */
htsApp.factory('feedFactory', ['$http', '$stateParams', '$location', '$q', 'Session', function($http, $stateParams, $location, $q, Session){

    var factory = {};

    factory.poll = function () {

        var deferred = $q.defer();

        //TODO: Lookup users selected categories we should poll for them

        var polling_api = '';

        if(Session.userObj.user_settings.safe_search) {
            polling_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/userfeed?categories=SSSS|RRRR|~PPPP|~MMMM";
        } else {
            polling_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/userfeed?categories=SSSS|RRRR";
        }

        if(factory.queryParams.anchor) {
            polling_api += "&anchor=" + factory.queryParams.anchor;
            polling_api += "&cityCode=" + factory.queryParams.cityCode;
        }

        $http({method: 'GET', url: polling_api}).
            then(function (response, status, headers, config) {

                console.log('polling response', response);

                factory.queryParams.anchor = response.data.external.anchor;
                factory.queryParams.cityCode = response.data.location.cityCode;

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };





    factory.lookupCategories = function () {

        var deferred = $q.defer();

        //TODO: Lookup users selected categories we should poll for them

        var reference_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/search/categorylookup";

        $http({method: 'GET', url: reference_api}).
            then(function (response, status, headers, config) {

                console.log('reference api response', response);

                //factory.categories = response.data;

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };



    return factory;
}]);