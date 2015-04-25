/**
 * Created by braddavis on 4/2/15.
 */

htsApp.factory('profileFactory', ['$http', '$location', '$q', 'ENV', function ($http, $location, $q, ENV) {

    var factory = {};


    factory.messages = {
        private: {
            sent: [],
            received: []
        }
    };



    factory.nav = [
        {
            title: 'Messages',
            link: 'profile.messages',
            data: factory.messages
        },
        {
            title: 'Reviews',
            link: 'profile.reviews',
            data: []
        }
    ];








    factory.getUserProfile = function (username) {

        var deferred = $q.defer();

        var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/getprofile?username=" + username;

        $http({method: 'GET', url: url}).
            then(function (response, status, headers, config) {

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;

    };




    return factory;

}]);