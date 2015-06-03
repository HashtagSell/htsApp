/**
 * Created by braddavis on 5/1/15.
 */
htsApp.controller('categorySelectorBar', ['$scope',  '$rootScope', '$state', 'Session', 'ivhTreeviewMgr', 'authModalFactory', 'categoryFactory', function ($scope, $rootScope, $state, Session, ivhTreeviewMgr, authModalFactory, categoryFactory) {


    //Any time the user moves to a different page this function is called.
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'feed' || toState.name === 'feed.splash') {
            $scope.showCategorySelectorBar = true;
        } else {
            $scope.showCategorySelectorBar = false;
        }
    });

    //This obj binded to view to create category tree checklist
    $scope.feedCategoryObj = {};

    //Get the users categories they have chosen to watch in their feed.
    $scope.feedCategoryObj.userDefaultCategories = Session.userObj.user_settings.feed_categories;

    //Fetch all the possible categories from the server and pass them function that creates nested list the tree checklist UI can understand
    $scope.getAllCategoriesFromServer = function () {
        categoryFactory.lookupCategories().then(function (response) {

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
            $state.go('signup');
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


}]);