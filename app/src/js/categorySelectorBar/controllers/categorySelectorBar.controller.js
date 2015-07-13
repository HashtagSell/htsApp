/**
 * Created by braddavis on 5/1/15.
 */
htsApp.controller('categorySelectorBar', ['$scope',  '$rootScope', '$state', 'Session', 'ivhTreeviewMgr', 'feedFactory', function ($scope, $rootScope, $state, Session, ivhTreeviewMgr, feedFactory) {


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
    $scope.feedCategoryObj.nestedCategories = Session.userObj.user_settings.feed_categories;

    //This function called when user checks or unchecks any item on the category tree.
    $scope.categoryOnChange = function(node, isSelected, tree) {
        console.log('node', node);
        console.log('isSelected', isSelected);
        console.log('tree', tree);
        var stanitizedTree = JSON.parse(angular.toJson(tree));
        console.log('sanitized tree', stanitizedTree);

        //Update the server
        Session.setSessionValue('feed_categories', stanitizedTree, function (response) {
            if (response.status !== 200) {
                alert('could not remove category from user feed.  please notify support.');
            }
        });

        feedFactory.filterFeed(stanitizedTree);
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