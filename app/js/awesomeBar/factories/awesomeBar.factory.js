/**
 * Created by braddavis on 4/26/15.
 */
htsApp.factory('awesomeBarFactory', ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {

    var factory = {};


    factory.queryObj = {
        q: $stateParams.q || "I'm searching for...",
        city: null,
        locationObj: null
    };



    factory.googleMap = new google.maps.Map(document.createElement("map-canvas"));


    factory.predictPlace = function (city) {

        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(37.79738, -122.52464),
            new google.maps.LatLng(37.68879, -122.36122)
        );

        //need to set bounds to cornwall/bodmin
        var locationRequest = {
            input: city,
            bounds: defaultBounds,
            componentRestrictions: {country: 'US'}
        };

        var googlePlacesService = new google.maps.places.AutocompleteService();

        var deferred = $q.defer();

        //Get predictions from google
        googlePlacesService.getPlacePredictions(locationRequest, function (predictions, status) {
            deferred.resolve(predictions);
        });

        return deferred.promise;
    };



    factory.getCityMetaData = function (selectedPlace) {

        var googleMaps = new google.maps.places.PlacesService(factory.googleMap);

        //capture the place_id and send to google maps for metadata about the place
        var request = {
            placeId: selectedPlace.place_id
        };

        var deferred = $q.defer();

        googleMaps.getDetails(request, function (placeMetaData, status) {

            //TODO: Handle status and if google fail

            deferred.resolve(placeMetaData);
        });

        return deferred.promise;
    };

    return factory;

}]);