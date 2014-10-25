htsApp.controller('awesomeBarController', ['$window', '$scope', '$location', 'Session', 'geolocationService', 'UpdatePlaceholder', function ($window, $scope, $location, Session, geolocationService, UpdatePlaceholder) {


//    //This function will add the appropirate HTML into any div with the class .awesomeBar
//    $scope.lookupLocation = function () {
//
//        $scope.loading = true;
//
//        $scope.placeholder = UpdatePlaceholder;
//
//        var service = $window.location.protocol + '//freegeoip.net/json/';
//
//        var firstAttempt = geolocationService.locateUser(service);
//
//        firstAttempt.then(function (response) {
//
//            $scope.userLocationObject = response;
//            $scope.loading = false;
//
//        }, function (reason) {
//
//            console.log("trying backup service");
//
//            var secondService = $window.location.protocol + '//www.telize.com/geoip';
//
//            var secondAttempt = geolocationService.locateUser(secondService);
//
//            secondAttempt.then(function (response) {
//
//                $scope.userLocationObject = response;
//                $scope.loading = false;
//
//            }, function (reason) {
//
//                console.log("Falling back to manual city search");
//
//                $scope.userLocationObject = {};
//
//                $scope.loading = false;
//
//                $scope.userLocationObject.geoLocationSuccess = false;
//                $scope.userLocationObject.manualCitySearch = {};
//                $scope.userLocationObject.manualCitySearch.request = true;
//
//            });
//
//        });
//
//    }
//
//    $scope.lookupLocation();

    //Redirects to results page with correct params
    $scope.awesomeBarSubmit = function () {
        $location.path("/search/"+$scope.query+"/");
//        if ($scope.userLocationObject.manualCitySearch.lat && $scope.userLocationObject.manualCitySearch.lon) {
//            console.log($scope.userLocationObject.manualCitySearch);
//            console.log("redirecting");
//            var redirectUrl = "/results?q=" + $scope.userLocationObject.manualCitySearch.query + "&city=" + $scope.userLocationObject.manualCitySearch.cityCommaState + "&lat=" + $scope.userLocationObject.manualCitySearch.lat + "&lon=" + $scope.userLocationObject.manualCitySearch.lon;
//            console.log(redirectUrl);
//            $window.location.href = redirectUrl;
//        } else {
//
//        }
    }

}]);


htsApp.directive('googleplace', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, model) {
            var options = {
                types: ['(cities)'],
                componentRestrictions: {country: 'us'}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function () {

                var latlongString = this.getPlace().geometry.location.toString();
                var cleanlatlongString = latlongString.substring(1, latlongString.length - 1);
                var latlonArray = cleanlatlongString.split(',');

                scope.userLocationObject.manualCitySearch.lat = latlonArray[0];
                scope.userLocationObject.manualCitySearch.lon = latlonArray[1].substring(1);
                scope.userLocationObject.manualCitySearch.cityCommaState = this.getPlace().formatted_address;

                scope.$apply(function () {
                    model.$setViewValue(element.val());
                });

                scope.awesomeBarSubmit();
            });
        }
    };
});