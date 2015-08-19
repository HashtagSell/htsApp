htsApp.controller('awesomeBarController', ['$window', '$scope', '$location', 'awesomeBarFactory', 'searchFactory', '$state', function ($window, $scope, $location, awesomeBarFactory, searchFactory, $state) {


    //$scope.clearCity = function () {
    //    console.log('clearing city');
    //    $scope.queryObj.city = null;
    //    $scope.queryObj.locationObj = null;
    //};


    $scope.queryObj = awesomeBarFactory.queryObj;


    $scope.handlePaste = function ($event) {
        $event.preventDefault();
        $scope.queryObj.q = $event.originalEvent.clipboardData.getData('text/plain');
    };

    //Redirects to results page with correct params
    $scope.awesomeBarSubmit = function () {

        console.log('==================== RUNNING AWESOMEBAR SUBMIT ====================');

        $scope.advancedSearch.visible = false; //Hide advanced search

        if($scope.queryObj.q) {

            console.log('before sanatize', $scope.queryObj);

            searchFactory.resetResultsView();

            //cache the entire users search string before we strip it apart and build our query object
            var entireSearchString = $scope.queryObj.q;

            var strippedHTML = strip($scope.queryObj.q);

            console.log('stripped html', strippedHTML);

            var subString = strippedHTML.replace('@' + $scope.queryObj.city, "").trim();

            console.log('trimmed string', subString);

            $scope.queryObj.q = subString;

            console.log('after sanatize', $scope.queryObj);

            $state.go('results', $scope.queryObj, {'reload':true});

            $scope.queryObj.q = entireSearchString;
        }

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
            return awesomeBarFactory.predictPlace(city).then(function (results) {

                $scope.cities = results;

                return results.map(function(item){
                    return item;
                });
            });
        }
    };


    $scope.getCityMetaData = function (selectedCity) {

        console.log('selected city: ', selectedCity);
        awesomeBarFactory.getCityMetaData(selectedCity).then(function (cityMetaData) {

            $scope.queryObj.city = selectedCity.description;

            $scope.queryObj.locationObj = cityMetaData;

        });
        return '<span class="mention-highlighter-location" contentEditable="false">@' + selectedCity.description + '</span>';
    };


    $scope.advancedSearch = {
        visible: false
    };

}]);
