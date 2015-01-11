/**
 * Created by braddavis on 12/15/14.
 */
htsApp.controller('feed.controller', ['$scope', 'feedFactory', 'splashFactory', '$state', '$interval', 'Session', 'ivhTreeviewMgr', function ($scope, feedFactory, splashFactory, $state, $interval, Session, ivhTreeviewMgr) {

    //While true the hashtagspinner will appear
    $scope.pleaseWait = true;

    feedFactory.queryParams = {};


    $scope.slickConfig = {
        dots: true,
        lazyLoad: 'progressive',
        infinite: true,
        speed: 100,
        slidesToScroll: 2,
        //TODO: Track this bug to allow for variableWidth on next release: https://github.com/kenwheeler/slick/issues/790
        variableWidth: true,
        onInit: function () {
            jQuery(window).resize();
            console.log('photo carousel loaded');
        },
        centerMode: true

    };


    //updateFeed is triggered on interval and performs polling call to server for more items
    var updateFeed = function () {

        $scope.currentDate = Math.floor(Date.now() / 1000);

        feedFactory.poll().then(function (response) {

            if(response.status !== 200) {

                $scope.results = response.data.error;

            } else if (response.status === 200) {

                //TODO: If response has no results increase poll to 15 min.  Perhaps josh can add this on MaxRetry functionality
                if(response.data.external.postings.length > 0) { //If we have at least one result
                    if (!$scope.results) { //If there are not results on the page yet, put them on page


                        //TODO: Seems 3Taps items are not really sorted by newest to oldest.  May need Josh to sort these when we hit his posting API

                        //Depending on number of images we add the a feedItemHeight property to each result.  This is used for virtual scrolling
                        for(i = 0; i < response.data.external.postings.length; i++) {
                            if (response.data.external.postings[i].images.length === 0 || response.data.external.postings[i].images.length === 1) {
                                response.data.external.postings[i].feedItemHeight = 300;
                            } else if (response.data.external.postings[i].images.length > 1) {
                                response.data.external.postings[i].feedItemHeight = 485;
                            }
                        }

                        $scope.pleaseWait = false;

                        $scope.results = response.data.external.postings;


                    } else { //If there are already results on the page the add them to the top of the array

                        console.log('our new items', response.data.external.postings);

                        //Capture how far user has scroll down.
                        var scrollTopOffset = jQuery(".inner-container").scrollTop();

                        //Depending on number of images we add the a feedItemHeight property to each result.  This is used for virtual scrolling
                        for(i = 0; i < response.data.external.postings.length; i++){


                            if (response.data.external.postings[i].images.length === 0 || response.data.external.postings[i].images.length === 1) {
                                response.data.external.postings[i].feedItemHeight = 300;
                                scrollTopOffset = scrollTopOffset + 300;
                            } else if (response.data.external.postings[i].images.length > 1) {
                                response.data.external.postings[i].feedItemHeight = 485;
                                scrollTopOffset = scrollTopOffset + 485;
                            }

                            //Push each new result to top of feed
                            $scope.results.unshift(response.data.external.postings[i]);
                        }

                        //Offset scroll bar location to page does not move after inserting new items.
                        jQuery(".inner-container").scrollTop(scrollTopOffset);

                    }
                } else {
                    //updateFeed();
                }

            }
        }, function (response) {

            console.log(response);

            //TODO: Use modal service to notify users
            //alert("polling error");

        });
    };
    updateFeed();


    var intervalUpdate = $interval(updateFeed, 30000, 0, true);

    //This is called when user changes route. It stops javascript from interval polling in background.
    $scope.$on('$destroy', function () {
        $interval.cancel(intervalUpdate);
    });


    //TODO: When user pulls down from top of screen perform poll and reset interval
    //openSplash called when suer clicks on item in feed for more details.
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        console.log(splashFactory.result);
        $state.go('feed.splash', { id: elems.result.external_id });
    };


    //This obj binded to view to create category tree checklist
    $scope.feedCategoryObj= {};

    //Get the users categories they have chosen to watch in their feed.
    $scope.feedCategoryObj.userDefaultCategories = Session.userObj.user_settings.feed_categories;


    //Fetch all the possible categories from the server and pass them function that creates nested list the tree checklist UI can understand
    $scope.getAllCategoriesFromServer = function () {
        feedFactory.lookupCategories().then(function (response) {

            console.log(response);

            if(response.status !== 200) {

                console.log(response.data.error);

            } else if (response.status === 200) {

                //$scope.categories = response.data.categories;
                formatCategories(response.data.categories);

            }
        }, function (response) {

            console.log(response);

            //TODO: Use modal service to notify users
            alert("category lookup error");

        });
    };
    $scope.getAllCategoriesFromServer();



    var formatCategories = function (serverCategories) {

        var nestedCategories = [];

        nestedCategories.push({
            'name': serverCategories[0].group_name,
            'code': serverCategories[0].group_code,
            'selected' : isCategoryDefaultSelected(serverCategories[0].group_code),
            'children': [{
                'name': serverCategories[0].name,
                'code': serverCategories[0].code,
                'selected' : isCategoryDefaultSelected(serverCategories[0].code)
            }]
        });

        //3Taps returns flat category structure.  We need nested structure.
        //Loop though all the categories and nest child categories under group categories.
        for (i = 1; i < serverCategories.length; i++) {

            //console.log(serverCategories[i].group_code);
            //console.log(serverCategories[i]);

            for (j = 0; j < nestedCategories.length; j++) {

                if (nestedCategories[j].code === serverCategories[i].group_code) { //If category group code is already found in our nestedCategories then add the child category to the group

                    nestedCategories[j].children.push({
                        'name': serverCategories[i].name,
                        'code': serverCategories[i].code,
                        'selected' : isCategoryDefaultSelected(serverCategories[i].code)
                    });
                    break;

                } else if (j == nestedCategories.length - 1) {

                    nestedCategories.push({
                        'name': serverCategories[i].group_name,
                        'code': serverCategories[i].group_code,
                        'selected' : isCategoryDefaultSelected(serverCategories[i].group_code),
                        'children': [{
                            'name': serverCategories[i].name,
                            'code': serverCategories[i].code,
                            'selected' : isCategoryDefaultSelected(serverCategories[i].code)
                        }]
                    });

                }

            }

        }

        ivhTreeviewMgr.validate(nestedCategories);

        $scope.feedCategoryObj.nestedCategories = nestedCategories;
    };


    //This function used while converting 3Taps flat category list into nested list.
    //If this function returns true the checkbox will be pre-checked in the UI when the page is loaded cause user set this preference previously.
    var isCategoryDefaultSelected = function (categoryCode) {
        for(k = 0; k < $scope.feedCategoryObj.userDefaultCategories.length; k++) {
            if($scope.feedCategoryObj.userDefaultCategories[k].code == categoryCode) {
                return true;
            } else if (k == $scope.feedCategoryObj.userDefaultCategories.length -1) {
                return false;
            }
        }
    };


    //This function called when user checks or unchecks any item on the category tree.
    $scope.categoryOnChange = function(node, isSelected, tree) {
        console.log(node, isSelected, tree);

        var newSelectedCategories = [];

        for(t = 0; t < tree.length; t++){
            if(!tree[t].selected){
                for(u = 0; u < tree[t].children.length; u++) {
                    if(tree[t].children[u].selected) {
                        newSelectedCategories.push(
                            {
                                'name': tree[t].children[u].name,
                                'code': tree[t].children[u].code
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
            if(response.status !== 200){
                alert('could not remove category from user feed.  please notify support.');
            }
        });
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