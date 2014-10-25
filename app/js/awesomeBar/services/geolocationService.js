/**
 * Created by braddavis on 10/19/14.
 */
htsApp.service('geolocationService', ['$http', '$q', function ($http, $q) {

    this.locateUser = function (service) {

        //This location object will store the response of attempted ip-Geolocation AJAX call
        var location = {};

        //This object inside the location object will be populated in case the user requests a city manually.
        location.manualCitySearch = {};

        var deferred = $q.defer();

        $http({method: 'GET', url: service}).
            then(function (response, status, headers, config) {

                //This location object will store the response of attempted ip-Geolocation AJAX call
                var location = {};

                //This object inside the location object will be populated in case the user requests a city manually.
                location.manualCitySearch = {};

                if (response.data.city && response.data.region_code && response.data.latitude && response.data.longitude) {

                    location.geoLocationSuccess = true;
                    location.manualCitySearch.request = false;
                    location.city = response.data.city;
                    location.stateAbbr = response.data.region_code;
                    location.cityCommaState = location.city + ', ' + location.stateAbbr;
                    location.state = response.data.region_name || response.data.region;
                    location.lon = response.data.longitude;
                    location.lat = response.data.latitude;
                    location.country = response.data.country_name;
                    location.countryAbbr = response.data.country_code;

                } else {
                    location.geoLocationSuccess = false;
                    location.manualCitySearch.request = true;

                }

                deferred.resolve(location);
            },
            function (response, status, headers, config) {

                deferred.reject(response);

            });

        return deferred.promise;

    };

}]);