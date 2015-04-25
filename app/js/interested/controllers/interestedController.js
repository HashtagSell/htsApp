/**
 * Created by braddavis on 10/29/14.
 */
htsApp.controller('myFavesController', ['$scope', '$window', 'favesFactory', 'splashFactory', '$state', 'ngTableParams', '$filter', 'Session', 'quickComposeFactory', '$modal', '$log', function($scope, $window, favesFactory, splashFactory, $state, ngTableParams, $filter, Session, quickComposeFactory, $modal, $log) {

    $scope.currentFaves = Session.userObj.user_settings.favorites;

    if($scope.currentFaves.length === 0) {
        $scope.noItems = true;
    }

    favesFactory.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 2000, // include all favorites on page one
        filter: {},         // initial filter
        sorting: {}         // initial sort
    }, {
        counts: [], //hides page sizes
        total: $scope.currentFaves.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.currentFaves, favesFactory.filterString);
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    //Sets up ng-table params
    $scope.tableParams = favesFactory.tableParams;

    // Ugh... http://stackoverflow.com/questions/22892908/ng-table-typeerror-cannot-set-property-data-of-null
    $scope.tableParams.settings().$scope = $scope;


    //More info directives evaluate these values and display sent offers and questions about items
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.currentState = toState.name;
        $scope.expandedPostingId = toParams.postingId;
    });



    //Called when user clicks on remove button next to favorite
    $scope.removeFave = function(item){
        favesFactory.removeFave(item, function () {
            favesFactory.refreshTable();
        });
    };

    //Uncheck all the checkboxes by default
    $scope.checkboxes = { checked : false, items: {} };


    // watch for data checkboxes
    $scope.$watch('checkboxes.items', function(values) {
        if (!$scope.currentFaves) {
            return;
        }
        var checked = 0, unchecked = 0;
        totalFaves = $scope.currentFaves.length;
        angular.forEach($scope.currentFaves, function(favorite) {
            checked   +=  ($scope.checkboxes.items[favorite.postingId]) || 0;
            unchecked += (!$scope.checkboxes.items[favorite.postingId]) || 0;
        });

        console.log("checked: ", checked, "unchecked: ", unchecked);

        if ((unchecked === 0) && totalFaves !== 0 || (checked === 0) && totalFaves !== 0) {
            $scope.checkboxes.masterCheck = (checked == totalFaves);
        }
        if(checked === 0 || totalFaves === 0){
            $scope.checkboxes.checked = false;
        } else {
            $scope.checkboxes.checked = true;
        }
        angular.element(document.getElementById("select_all")).prop("indeterminate", (checked !== 0 && unchecked !== 0));
    }, true);

    // watch for master checkbox
    $scope.$watch('checkboxes.masterCheck', function(value) {
        angular.forEach($scope.currentFaves, function(favorite) {
            if (angular.isDefined(favorite.postingId)) {
                $scope.checkboxes.items[favorite.postingId] = value;
            }
        });
    });

    //Declaring filters var so it can be attached to ng-table
    $scope.filters = {
        $: ''
    };

    //Filtering by all fields in table http://plnkr.co/edit/llb5k6?p=preview
    $scope.$watch("filters.$", function (value) {
        favesFactory.filterString = value;
        console.log(favesFactory.filterString);
        $scope.tableParams.reload();
//        favesFactory.tableParams.page(1);
    });


    //Takes a list of all the selected items and removes them from user favorites
    $scope.batchRemoveFaves = function(checkedItems) {
        favesFactory.batchRemoveFaves(checkedItems);
        $scope.checkboxes = { checked : false, items: {} }; //Uncheck all the favorites
    };

    //Takes a list of all the selected items and creates and email with address in BCC field
    $scope.batchEmail = function(checkedItems) {


        var currentFavorites = $scope.currentFaves;

        var results = [];

        angular.forEach(checkedItems.items, function(selectedStatus, id) { //loop through all the favorites and find the ones that are checked
            if(selectedStatus) {  //Make sure the favorite is checked
                console.log('this item selected', selectedStatus, id);
                for(i=0; i<currentFavorites.length; i++){ //loop through each favorites metadata
                    if(currentFavorites[i].postingId == id){  //Match the id of checked favorite and get the rest of metadata from localstorage
                        results.push(currentFavorites[i]);
                    }
                }
            }
        });

        console.log(results);


        if(Session.userObj.user_settings.email_provider[0].value === "ask") {  //If user needs to pick their email provider

            var modalInstance = $modal.open({
                templateUrl: 'js/transactionButtons/modals/email/partials/transactionButtons.modal.email.partial.html',
                controller: 'quickComposeController',
                resolve: {
                    result: function () {
                        return results;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if (reason === "signUp") {
                    authModalFactory.signUpModal();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });

        } else {  //User already set their default email provider

            quickComposeFactory.generateMailTo(Session.userObj.user_settings.email_provider[0].value, results);

        }
    };

    $scope.UserLabels = favesFactory.getUserLabels(); //Gets all the users custom labels for the labels dropdown
    $scope.selected_labels = []; //Stores which labels are checked or not
    $scope.preselected = {name : []};  //Labels that should be pre-checked when user drops down labels menu

    $scope.removeIndividualLabel = function($event){
        event.stopPropagation();
        alert("Quick remove label feature soon.  Please check the item and remove the label for now.");
    };

    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(favorite){
        splashFactory.result = favorite;
        console.log(splashFactory.result);
        $state.go('watchlist.splash', { id: favorite.postingId });
    };

}]);