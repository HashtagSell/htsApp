/**
 * Created by braddavis on 11/15/14.
 */
htsApp.controller('splashController', ['$scope', '$sce', '$state', '$modal', 'splashFactory', function ($scope, $sce, $state, $modal, splashFactory) {

    var splashInstanceCtrl = ['$scope', '$q', function ($scope, $q) {

        console.log(splashFactory.result);

        $scope.body = $sce.trustAsHtml(splashFactory.result.body);
        $scope.category = splashFactory.result.category;
        $scope.category_group = splashFactory.category_group;
        $scope.distanceFromUser = splashFactory.result.distanceFromUser;
        $scope.external_id = splashFactory.result.external_id;
        $scope.external_url = splashFactory.result.external_url;
        $scope.heading = $sce.trustAsHtml(splashFactory.result.heading);
        if (splashFactory.result.images.length) {
            //console.log(splashFactory.result.images);
            $scope.images = splashFactory.result.images;
        }
        $scope.location = splashFactory.result.location;
        $scope.price = splashFactory.result.price;
        $scope.source = splashFactory.result.source;


        $scope.map = {
            center: {
                latitude: splashFactory.result.location.lat,
                longitude: splashFactory.result.location.long
            },
            options: {
                zoomControl : false,
                mapTypeControl : false
            },
            zoom: 17
        };


        //Infowindow above map marker displays address or cross streets.  If data not supplied by 3Taps we use google to reverse geocode lat lon
        $scope.reverseGeocode = function (locationObj) {
            if (locationObj.formatted_address) {

                $scope.formatted_address = locationObj.formatted_address;

            } else {

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(locationObj.lat, locationObj.long);

                geocoder.geocode({'latLng': latlng}, function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            console.log('reverse geocoded info', results[1].formatted_address);

                            $scope.formatted_address = results[1].formatted_address;
                        } else {
                            $scope.infoWindow.show = false;
                        }
                    } else {
                        $scope.infoWindow.show = false;
                        console.log('geocoder failed???');
                    }
                });


            }
        };

        $scope.reverseGeocode(splashFactory.result.location);

        $scope.marker = {
            id: 0,
            coords: {
                latitude: splashFactory.result.location.lat,
                longitude: splashFactory.result.location.long
            }
        };

        $scope.infoWindow = {
            show: true
        };

        console.log($scope.marker);


        var annotationsDictionary = new Hashtable();

        annotationsDictionary.put("source_neighborhood","Neighborhood");
        annotationsDictionary.put("year","Year");
        annotationsDictionary.put("make","Make");
        annotationsDictionary.put("title_status","Title");
        annotationsDictionary.put("model","Model");
        annotationsDictionary.put("mileage","Mileage");
        annotationsDictionary.put("transmission","Transmission");
        annotationsDictionary.put("drive","Drive");
        annotationsDictionary.put("paint_color","Paint");
        annotationsDictionary.put("type","Type");
        annotationsDictionary.put("fuel","Fuel");
        annotationsDictionary.put("size","Size");
        annotationsDictionary.put("bathrooms","Bath");
        annotationsDictionary.put("available","Available");
        annotationsDictionary.put("no_smoking","Smoking");
        annotationsDictionary.put("bedrooms","Rooms");
        annotationsDictionary.put("dogs","Dogs");
        annotationsDictionary.put("cats","Cats");
        annotationsDictionary.put("attached_garage","Garage");
        annotationsDictionary.put("laundry_on_site","Laundry");
        annotationsDictionary.put("sqft","Sq Ft");
        annotationsDictionary.put("size_dimensions","Dimensions");



        $scope.sanitizeAnnotations = function (annoationsObj) {

            $scope.sanitizedAnnotationsObj = {};

            angular.forEach(annoationsObj, function(value, key) {
                console.log(key + ': ' + value);

                var validatedKey = annotationsDictionary.get(key);

                if (validatedKey) {
                    $scope.sanitizedAnnotationsObj[validatedKey] = value;
                }


            });

            return $scope.sanitizedAnnotationsObj;
        };


        if(splashFactory.result.annotations) {

            $scope.annotations = $scope.sanitizeAnnotations(splashFactory.result.annotations);

            console.log('here are sanatized annotations', $scope.annotations);
        }

    }];

    var splashInstance = $modal.open({
        backdrop: false,
        templateUrl: "js/splash/partials/splash_content.html",
        windowTemplateUrl: "js/splash/partials/splash_window.html",
        controller: splashInstanceCtrl,
        resolve: {
            //mentionsFactory: ['$q', '$http', function ($q, $http) {
            //
            //    var factory = {}; //init the factory
            //
            //
            //    return factory;
            //}]
        }
    });


    splashInstance.result.then(function (selectedItem) {
        console.log(selectedItem);
    }, function () {
        console.log('Splash dismissed at: ' + new Date());
        splashInstance.dismiss();
        $state.go('^');
    });


    //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
    $scope.$on('$stateChangeStart', function () {
        splashInstance.dismiss();
    });


}]);