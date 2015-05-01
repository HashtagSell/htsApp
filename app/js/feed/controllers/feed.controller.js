/**
 * Created by braddavis on 12/15/14.
 */
htsApp.controller('feed.controller', ['$scope', 'feedFactory', 'splashFactory', '$state', '$interval', 'Session', 'ivhTreeviewMgr', 'authModalFactory', function ($scope, feedFactory, splashFactory, $state, $interval, Session, ivhTreeviewMgr, authModalFactory) {

    $scope.status = feedFactory.status;

    $scope.slickConfig = {
        dots: true,
        lazyLoad: 'progressive',
        infinite: true,
        speed: 100,
        slidesToScroll: 1,
        variableWidth: true,
        centerMode: true
    };


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
                            posting.feedItemHeight = 290;
                        } else if (posting.images.length === 1) {
                            posting.feedItemHeight = 290;

                            if (posting.username === 'CRAIG') {
                                if(posting.images[0].full) {
                                    posting.images[0].full = posting.images[0].full.replace(/^http:\/\//i, 'https://');
                                }

                                if(posting.images[0].thumb) {
                                    posting.images[0].thumb = posting.images[0].thumb.replace(/^http:\/\//i, 'https://');
                                }

                                if(posting.images[0].images) {
                                    posting.images[0].images = posting.images[0].images.replace(/^http:\/\//i, 'https://');
                                }
                            }

                        } else if (posting.images.length > 1) {
                            posting.feedItemHeight = 455;

                            if (posting.username === 'CRAIG') {

                                for(var j=0; j < posting.images.length; j++){
                                    var imageObj = posting.images[j];

                                    if(imageObj.full) {
                                        imageObj.full = imageObj.full.replace(/^http:\/\//i, 'https://');
                                    }

                                    if(imageObj.thumb) {
                                        imageObj.thumb = imageObj.thumb.replace(/^http:\/\//i, 'https://');
                                    }

                                    if(imageObj.images) {
                                        imageObj.images = imageObj.images.replace(/^http:\/\//i, 'https://');
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

                    //UI will query polling API every 30 seconds
                    var intervalUpdate = $interval(updateFeed, 60000, 0, true);

                    //This is called when user changes route. It stops javascript from interval polling in background.
                    $scope.$on('$destroy', function () {
                        $interval.cancel(intervalUpdate);
                    });

                } else { //If there are already results on the page the add them to the top of the array

                    //console.log('our new items', response.data.external.postings);

                    //Capture how far user has scroll down.
                    var scrollTopOffset = jQuery(".inner-container").scrollTop();

                    //Depending on number of images we add the a feedItemHeight property to each result.  This is used for virtual scrolling
                    for (i = 0; i < response.data.external.postings.length; i++) {


                        if (response.data.external.postings[i].images.length === 0 || response.data.external.postings[i].images.length === 1) {
                            response.data.external.postings[i].feedItemHeight = 290;
                            scrollTopOffset = scrollTopOffset + 290;
                        } else if (response.data.external.postings[i].images.length > 1) {
                            response.data.external.postings[i].feedItemHeight = 455;
                            scrollTopOffset = scrollTopOffset + 455;
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


    //This obj binded to view to create category tree checklist
    $scope.feedCategoryObj = {};

    //Get the users categories they have chosen to watch in their feed.
    $scope.feedCategoryObj.userDefaultCategories = Session.userObj.user_settings.feed_categories;


    //Fetch all the possible categories from the server and pass them function that creates nested list the tree checklist UI can understand
    $scope.getAllCategoriesFromServer = function () {
        feedFactory.lookupCategories().then(function (response) {

            if(response.status !== 200) {

                console.log(response.data.error);

            } else if (response.status === 200) {

                $scope.feedCategoryObj.nestedCategories = formatCategories(response.data.results);

                console.log($scope.feedCategoryObj.nestedCategories);

            }
        }, function (response) {

            console.log(response);

            //TODO: Use modal service to notify users
            console.log("category lookup error");

        });
    };
    $scope.getAllCategoriesFromServer();



    var formatCategories = function (serverCategories) {

        var safeSearchOn = Session.userObj.user_settings.safe_search;
        var sanitizedCategoryList = [];

        for (var i = 0; i < serverCategories.length; i++) {

            var parentCategory = serverCategories[i];

            switch (parentCategory.code) {
                case 'SSSS':
                case 'VVVV':
                case 'RRRR':
                case 'MMMM':
                case 'PPPP':
                    if(safeSearchOn && parentCategory.code === 'PPPP' ||  safeSearchOn && parentCategory.code === 'MMMM') { //If safe search is turned on
                        continue;
                    } else {
                        parentCategory.name = toTitleCase(parentCategory.name);
                        parentCategory.selected = isCategoryDefaultSelected(parentCategory.code);

                        for (var j = 0; j < parentCategory.categories.length; j++) {

                            var childCategory = parentCategory.categories[j];

                            childCategory.name = toTitleCase(childCategory.name);
                            childCategory.selected = isCategoryDefaultSelected(childCategory.code);

                            if (childCategory.selected) {
                                parentCategory.selected = true;
                            }
                        }

                        sanitizedCategoryList.push(parentCategory);
                    }
            }
        }

        ivhTreeviewMgr.validate(sanitizedCategoryList);

        console.log(sanitizedCategoryList);

        return sanitizedCategoryList;
    };

    //Capitalize first char of every word in sentence string
    function toTitleCase(str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }


    //This function used while converting 3Taps flat category list into nested list.
    //If this function returns true the checkbox will be pre-checked in the UI when the page is loaded cause user set this preference previously.
    var isCategoryDefaultSelected = function (categoryCode) {
        for(var k = 0; k < $scope.feedCategoryObj.userDefaultCategories.length; k++) {
            if($scope.feedCategoryObj.userDefaultCategories[k].code === categoryCode) {
                return true;
            } else if (k === $scope.feedCategoryObj.userDefaultCategories.length -1) {
                return false;
            }
        }
    };


    //This function called when user checks or unchecks any item on the category tree.
    $scope.categoryOnChange = function(node, isSelected, tree) {
        console.log(node, isSelected, tree);

        if(Session.userObj.user_settings.loggedIn) { //If the user is logged in

            var newSelectedCategories = [];

            for (t = 0; t < tree.length; t++) {
                if (!tree[t].selected) {
                    for (u = 0; u < tree[t].categories.length; u++) {
                        if (tree[t].categories[u].selected) {
                            newSelectedCategories.push(
                                {
                                    'name': tree[t].categories[u].name,
                                    'code': tree[t].categories[u].code
                                }
                            );
                        }
                    }
                } else {
                    newSelectedCategories.push(
                        {
                            'name': tree[t].name,
                            'code': tree[t].code
                        }
                    );
                }


            }

            console.log(newSelectedCategories);

            //Update the server
            Session.setSessionValue('feed_categories', newSelectedCategories, function (response) {
                if (response.status !== 200) {
                    alert('could not remove category from user feed.  please notify support.');
                }
            });

        } else {
            //TODO: Deselect the checked item cause user is not logged in.
            ivhTreeviewMgr.deselect($scope.feedCategoryObj.nestedCategories, node.name, false);
            authModalFactory.signInModal();
        }
    };

    //If the categoryFilter input experiences a change then expand that entire category tree as user types to filter
    $scope.expandTree = function () {
        ivhTreeviewMgr.expandRecursive($scope.feedCategoryObj.nestedCategories);
    };


    //Watches the category filter input.  If emptied then collapse the category tree
    $scope.$watch('filterCategories', function (newVal, oldVal) {
        if(newVal === '') {
            ivhTreeviewMgr.collapseRecursive($scope.feedCategoryObj.nestedCategories);
        }
    });


    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        feedFactory.resetFeedView();
    });

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