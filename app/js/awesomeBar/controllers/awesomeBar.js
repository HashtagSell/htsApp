htsApp.controller('awesomeBarController', ['$window', '$scope', '$location', 'awesomeBarFactory', '$state', 'searchFactory', function ($window, $scope, $location, awesomeBarFactory, $state, searchFactory) {

    //$scope.awesomeText = "I'm searching for...";

    $scope.clearedPlaceholder = false;
    $scope.clearPlaceholder = function () {
        if (!$scope.clearedPlaceholder) {
            console.log("clearing placeholder");

            $scope.queryObj.q = "";
            $scope.clearedPlaceholder = true;
        }
    };






    $scope.queryObj = awesomeBarFactory.queryObj;

    //Redirects to results page with correct params
    $scope.awesomeBarSubmit = function () {

        searchFactory.resetResultsView();

        //cache the entire users search string before we strip it apart and build our query object
        var entireSearchString = $scope.queryObj.q;

        if($scope.queryObj.locationObj) {

            var strippedHTML = strip($scope.queryObj.q);

            var subString = strippedHTML.replace('@' + $scope.queryObj.city, "").trim();

            $scope.queryObj.q = subString;
        }

        $state.go('results', $scope.queryObj);

        $scope.queryObj.q = entireSearchString;
    };

    function strip(html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }



    $scope.validateQueryObj = function () {
        if($scope.queryObj.locationObj) {
            if($scope.queryObj.q.indexOf('@') === -1) {
                $scope.queryObj.city = null;
                $scope.queryObj.locationObj = null;
            }
        }
    };



    ////========= @ Places Ment.io trigger =========
    $scope.map = awesomeBarFactory.googleMap;

    $scope.searchPlaces = function (city) {
        if (city) {
            awesomeBarFactory.predictPlace(city).then(function (results) {
                $scope.cities = results;
                console.log("Here is scope.cities", $scope.cities);
            });
        }
    };

    $scope.getCityMetaData = function (selectedCity) {
        awesomeBarFactory.getCityMetaData(selectedCity).then(function (cityMetaData) {

            $scope.queryObj.city = selectedCity.description;

            $scope.queryObj.locationObj = cityMetaData;

        });
        return '<span class="mention-highlighter-location" contentEditable="false">@' + selectedCity.description + '</span>';
    };

}]);
