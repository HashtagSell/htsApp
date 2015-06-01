/**
 * Created by braddavis on 12/15/14.
 */
htsApp.controller('feed.controller', ['$scope', 'feedFactory', 'splashFactory', '$state', '$interval', function ($scope, feedFactory, splashFactory, $state, $interval) {

    $scope.status = feedFactory.status;

    //updateFeed is triggered on interval and performs polling call to server for more items
    var updateFeed = function () {

        $scope.currentDate = Math.floor(Date.now() / 1000);

        //If this is the first query from controller and we have data in feedFactory already then resume from persisted data.
        if (!$scope.results && feedFactory.persistedResults){
            console.log('recovering from persisted results', feedFactory.persistedResults);
            $scope.results = feedFactory.persistedResults;
            var resumePersisted = true;
        } else if (!$scope.results) {
            //While true the hashtagspinner will appear
            feedFactory.status.pleaseWait = true;
        }


        feedFactory.poll().then(function (response) {

            if (response.status !== 200) {

                $scope.status.pleaseWait = false;
                $scope.status.error.message = ":( Oops.. Something went wrong.";
                $scope.status.error.trace = response.data.error;

            } else if (response.status === 200) {

                if (!$scope.results || resumePersisted) { //If there are not results on the page yet, this is our first query

                    //TODO: Seems 3Taps items are not always sorted by newest to oldest.  May need Josh to sort these when we hit his posting API
                    //Calculate the number of results with images and add up scroll height. This is used for virtual scrolling
                    for (i = 0; i < response.data.external.postings.length; i++) {

                        var posting = response.data.external.postings[i];

                        if (posting.images.length === 0) {
                            posting.feedItemHeight = 179;
                        } else if (posting.images.length === 1) {
                            posting.feedItemHeight = 261;

                            if (posting.username === 'CRAIG') {
                                if(posting.images[0].full) {
                                    posting.images[0].full = posting.images[0].full.replace(/^http:\/\//i, '//');
                                }

                                if(posting.images[0].thumb) {
                                    posting.images[0].thumb = posting.images[0].thumb.replace(/^http:\/\//i, '//');
                                }

                                if(posting.images[0].images) {
                                    posting.images[0].images = posting.images[0].images.replace(/^http:\/\//i, '//');
                                }
                            }

                        } else {
                            posting.feedItemHeight = 420;

                            if (posting.username === 'CRAIG') {

                                for(var j=0; j < posting.images.length; j++){
                                    var imageObj = posting.images[j];

                                    if(imageObj.full) {
                                        imageObj.full = imageObj.full.replace(/^http:\/\//i, '//');
                                    }

                                    if(imageObj.thumb) {
                                        imageObj.thumb = imageObj.thumb.replace(/^http:\/\//i, '//');
                                    }

                                    if(imageObj.images) {
                                        imageObj.images = imageObj.images.replace(/^http:\/\//i, '//');
                                    }

                                }

                            }

                        }

                        if (resumePersisted) {
                            $scope.results.unshift(posting);
                        }
                    }

                    feedFactory.status.pleaseWait = false;

                    if (!resumePersisted) {
                        $scope.results = response.data.external.postings;
                    }


                    feedFactory.persistedResults = $scope.results.slice(0, 300);
                    resumePersisted = false;

                    //UI will query polling API every 60 seconds
                    var intervalUpdate = $interval(updateFeed, 15000, 0, true);

                    //This is called when user changes route. It stops javascript from interval polling in background.
                    $scope.$on('$destroy', function () {
                        console.log('pausing feed updates');
                        $interval.cancel(intervalUpdate);
                    });

                } else { //If there are already results on the page the add them to the top of the array

                    //console.log('our new items', response.data.external.postings);

                    //Capture how far user has scroll down.
                    var scrollTopOffset = jQuery(".inner-container").scrollTop();

                    //Depending on number of images we add the a feedItemHeight property to each result.  This is used for virtual scrolling
                    for (i = 0; i < response.data.external.postings.length; i++) {

                        if(response.data.external.postings[i].images.length === 0) {
                            response.data.external.postings[i].feedItemHeight = 179;
                            scrollTopOffset = scrollTopOffset + 179;
                        } else if (response.data.external.postings[i].images.length === 1) {
                            response.data.external.postings[i].feedItemHeight = 216;
                            scrollTopOffset = scrollTopOffset + 216;
                        } else {
                            response.data.external.postings[i].feedItemHeight = 420;
                            scrollTopOffset = scrollTopOffset + 420;
                        }

                        //Push each new result to top of feed
                        $scope.results.unshift(response.data.external.postings[i]);
                    }

                    //Offset scroll bar location to page does not move after inserting new items.
                    jQuery(".inner-container").scrollTop(scrollTopOffset);

                    //Persist our most recent 300 items
                    feedFactory.persistedResults = $scope.results.slice(0, 300);

                    console.log('persisted results are: ', feedFactory.persistedResults);

                }


            }
        }, function (response) {

            console.log(response);

            //TODO: Use modal service to notify users
            //alert("polling error");

        });
    };
    updateFeed();



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