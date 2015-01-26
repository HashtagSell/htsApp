htsApp.controller('awesomeBarController', ['$window', '$scope', '$location', 'newPostFactory', function ($window, $scope, $location, mentionsFactory) {

    //Redirects to results page with correct params
    $scope.awesomeBarSubmit = function () {
        $location.path("/results/"+$scope.query+"/");
    };

    ////========= # Products =========
    //$scope.searchProducts = function (term) {
    //    if (term) {
    //        mentionsFactory.predictProduct(term).then(function (results) {
    //            $scope.products = results;
    //            console.log("Here is scope.products", $scope.products);
    //        });
    //    }
    //};
    //
    //$scope.getProductTextRaw = function (product) {
    //    mentionsFactory.getProductMetaData(product).then(function (jsonTemplate) {
    //        console.log(jsonTemplate);
    //        console.log("done");
    //    });
    //    //return '<span class="mention-highlighter" contentEditable="false">#' + product.value + '</span>';
    //    return product.value;
    //};


    ////========= @ Places =========
    //$scope.map = mentionsFactory.googleMap;
    //
    //$scope.searchPlaces = function (term) {
    //    if (term) {
    //        mentionsFactory.predictPlace(term).then(function (results) {
    //            $scope.places = results;
    //            console.log("Here is scope.places", $scope.places);
    //        });
    //    }
    //};
    //
    //$scope.getPlacesTextRaw = function (selectedPlace) {
    //    mentionsFactory.getPlaceMetaData(selectedPlace).then(function (jsonTemplate) {
    //        console.log(jsonTemplate);
    //        console.log("done");
    //    });
    //    console.log("updated ui");
    //    //return '<span class="mention-highlighter" contentEditable="false">@' + selectedPlace.description + '</span>';
    //    return '@' + selectedPlace.description;
    //};

    ////========= $ Prices =========
    //$scope.searchPrice = function (term) {
    //    if (term) {
    //        $scope.prices = mentionsFactory.predictPrice(term);
    //        console.log("here is scope.prices", $scope.prices);
    //    }
    //};
    //
    //$scope.getPricesTextRaw = function (selectedPrice) {
    //    mentionsFactory.getPriceMetaData(selectedPrice);
    //    //return '<span class="mention-highlighter-price" contentEditable="false">$' + selectedPrice.suggestion + '</span>';
    //    return '$' + selectedPrice.suggestion;
    //};

}]);


//htsApp.directive('googleplace', function () {
//    return {
//        require: 'ngModel',
//        link: function (scope, element, attrs, model) {
//            var options = {
//                types: ['(cities)'],
//                componentRestrictions: {country: 'us'}
//            };
//            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
//
//            google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
//
//                var latlongString = this.getPlace().geometry.location.toString();
//                var cleanlatlongString = latlongString.substring(1, latlongString.length - 1);
//                var latlonArray = cleanlatlongString.split(',');
//
//                scope.userLocationObject.manualCitySearch.lat = latlonArray[0];
//                scope.userLocationObject.manualCitySearch.lon = latlonArray[1].substring(1);
//                scope.userLocationObject.manualCitySearch.cityCommaState = this.getPlace().formatted_address;
//
//                scope.$apply(function () {
//                    model.$setViewValue(element.val());
//                });
//
//                scope.awesomeBarSubmit();
//            });
//        }
//    };
//});