/**
 * Created by braddavis on 12/15/14.
 */
htsApp.controller('feed.controller', ['$scope', 'feedFactory', 'splashFactory', '$state', '$interval', 'socketio', 'geoFactory', 'Session', function ($scope, feedFactory, splashFactory, $state, $interval, socketio, geoFactory, Session) {

    $scope.spinner = feedFactory.spinner;

    //feedFactory.feed.categories = Session.userObj.user_settings.feed_categories;

    $scope.feed = feedFactory.feed;

    $scope.status = {
        error: null
    };

    $scope.currentDate = feedFactory.currentDate;


    var initFeed = function() {

        //While true the hashtagspinner will appear
        feedFactory.spinner.show = true;

        var sanitizedTree = Session.userObj.user_settings.feed_categories;

        if(!geoFactory.userLocation) {
            geoFactory.geolocateUser().then(function (response) {
                geoFactory.userLocation = response;
                initFeed();
            }, function (err) {

                feedFactory.spinner.show = false;

                $scope.status.error = err;

            });
        } else {
            if(!feedFactory.feed.unfiltered.length) {
                feedFactory.latest(geoFactory.userLocation, sanitizedTree).then(function (response) {
                    console.log('heres our most recent posts', response);

                    feedFactory.spinner.show = false;

                    socketio.joinLocationRoom('USA-' + geoFactory.userLocation.freeGeoIp.region_code, function () {

                    });
                }, function (err) {

                    feedFactory.spinner.show = false;

                    $scope.status.error = err;
                });
            } else {
                feedFactory.spinner.show = false;
            }
        }

    };
    initFeed();


    $scope.getScrollPosition = function(startIndex, endIndex){
        console.log('startIndex: ' + startIndex, 'endIndex: ' + endIndex, 'numRows: ' + $scope.feed.filtered.length);
        //if(!$scope.startIndexCached){
        //    $scope.startIndexCached = startIndex;
        //} else {
        //    if(startIndex + 3 < $scope.startIndexCached){
        //        $scope.startIndexCached = startIndex;
        //        alert('scrolling up!');
        //    }
        //}
    };



    //TODO: When user pulls down from top of screen perform poll and reset interval
    //openSplash called when suer clicks on item in feed for more details.
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        console.log(splashFactory.result);
        $state.go('feed.splash', { id: elems.result.postingId });
    };

}]);


//Filter used to calculate and format how long ago each item in the feed was posted.
htsApp.filter('secondsToTimeString', function() {
    return function(seconds) {
        var days = Math.floor(seconds / 86400);
        var hours = Math.floor((seconds % 86400) / 3600);
        var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
        var timeString = '';
        if(days > 0) timeString += (days > 1) ? (days + " days ") : (days + " day ");
        if(hours > 0) timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
        if(minutes >= 0) timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");
        return timeString;
    };
});





//This is called when user changes route. It stops javascript from interval polling in background.
//$scope.$on('$destroy', function () {
//    $interval.cancel(currentTimeInterval);
//
//    console.log('cancelled time updates for feed');
//
//    //socketio.leaveCityRoom(geoFactory.userLocation.cityCode.code, function() {
//    //
//    //});
//});

