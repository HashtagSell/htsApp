/**
 * Created by braddavis on 10/29/14.
 */
htsApp.controller('myFavesController', ['$scope', '$window', 'favesFactory', 'splashFactory', '$state', 'ngTableParams', '$filter', 'Session', function($scope, $window, favesFactory, splashFactory, $state, ngTableParams, $filter, Session) {

    $scope.currentFaves = Session.userObj.user_settings.favorites;

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
            checked   +=  ($scope.checkboxes.items[favorite.external_id]) || 0;
            unchecked += (!$scope.checkboxes.items[favorite.external_id]) || 0;
        });

        console.log("checked: ", checked, "unchecked: ", unchecked);

        if ((unchecked == 0) && totalFaves != 0 || (checked == 0) && totalFaves != 0) {
            $scope.checkboxes.masterCheck = (checked == totalFaves);
        }
        if(checked == 0 || totalFaves == 0){
            $scope.checkboxes.checked = false;
        } else {
            $scope.checkboxes.checked = true;
        }
        angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);

    // watch for master checkbox
    $scope.$watch('checkboxes.masterCheck', function(value) {
        angular.forEach($scope.currentFaves, function(favorite) {
            if (angular.isDefined(favorite.external_id)) {
                $scope.checkboxes.items[favorite.external_id] = value;
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
        favesFactory.batchEmail(checkedItems);
    };

    $scope.UserLabels = favesFactory.getUserLabels(); //Gets all the users custom labels for the labels dropdown
    $scope.selected_labels = []; //Stores which labels are checked or not
    $scope.preselected = {name : []}  //Labels that should be pre-checked when user drops down labels menu

    $scope.removeIndividualLabel = function($event){
        event.stopPropagation();
        alert("remove label feature soon");
    };

    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(favorite){
        splashFactory.result = favorite;
        console.log(splashFactory.result);
        $state.go('interested.splash', { id: favorite.external_id });
    };

}]);


htsApp.directive('dropdownMultiselect', ['favesFactory', function(favesFactory){
    return {
        restrict: 'E',
        scope:{
            selectedlabels: '=',
            userlabels: '=',
            selectedfaves: '=',
            placeholder: '=ngPlaceholder'
        },
        link: function (scope, element) { //Stops dropdown from closing when user clicks on input box
            element.bind('click', function (event) {
                event.stopPropagation();
            });
        },
        template: "<span class='dropdown'>"+
        "<i class='fa fa-tags dropdown-toggle' ng-click='open=!open;openDropdown()'>&nbsp;&nbsp;#Label</i>"+
        "<ul class='dropdown-menu'>"+
        "   <input ng-model='query' type='text' autofocus class='labels-input' placeholder='Filter or Create New Labels'/>" +
        "   <li ng-repeat='label in userlabels | filter:query' class='label-list'>" +
        "       <a ng-click='setSelectedItem()'>" +
        "           <span ng-click='deleteLabel($event)' class='fa fa-minus-circle pull-left delete-label'></span>#{{label.name}}" +
        "           <span ng-class='isChecked(label.name)'><span/>" +
        "       </a>" +
        "   </li>" +
        "   <li>" +
        "       <a dropdown-toggle ng-click='createNewLabel(query)' ng-show='ifQueryUnique(query)'>{{query}} (create new)</a>" +
        "   </li>" +
        "   <li>" +
        "       <a dropdown-toggle ng-click='applyChanges()' ng-show='updatesNecessary'>Apply</a>" +
        "   </li>" +
        "</ul>" +
        "</span>" ,
        controller: ['$scope', 'favesFactory', 'Session', function($scope, favesFactory, Session){

            $scope.currentFaves = Session.userObj.user_settings.favorites;

            $scope.openDropdown = function(){

                $scope.selectedlabels = [];
                $scope.updatesNecessary = false; //Hide the apply button from the user labels drop down

                console.log($scope);

                var currentFavorites = $scope.currentFaves;

                angular.forEach($scope.selectedfaves, function(selected, id) {
                    if(selected) {  //Make sure the item is checked
                        for(i=0; i<currentFavorites.length; i++){
                            if(currentFavorites[i].external_id == id && currentFavorites[i].labels){  //Using the ID of the checked item grab the email, heading, and other meta data from local storage.

                                for(j=0; j<currentFavorites[i].labels.length; j++){ //Loop though all the labels applied to the selected favorite
                                    var discoveredLabel = currentFavorites[i].labels[j];
                                    if (!_.contains($scope.selectedlabels, discoveredLabel)) {
                                        $scope.selectedlabels.push(discoveredLabel);
                                    }
                                }

                            }
                        }
                    }
                });
            };

            //Return boolean that specifies if the filter sting matches any existing labels... If false then user will see, "new label name (create label)".
            $scope.ifQueryUnique = function(query){
                var unique = true; //by default the create label functionality is shown
                if(!query){ //if the filter string is null
                    unique = false //don't show create label
                } else { //the input field has a value
                    _.find($scope.userlabels, function (label) { //loop through the users labels
                        if(label.name == query){ //if the filter string matches a label name
                            unique = false; //don't show create label
                        }
                    });
                }
                return unique;
            };

            $scope.createNewLabel = function(newLabel){
                var newLabelObj = {name : newLabel};  //formalize the new label
//                $scope.selectedlabels = []; //Uncheck all the selected labels so that only the new one is applied.
                favesFactory.addFavoriteLabel(newLabelObj); //hand new label to faves factory for processing
                $scope.userlabels = favesFactory.getUserLabels(); //get the update user labels TODO: Need a callback here
                $scope.setSelectedItem(newLabelObj.name);  //pass the name of the new label to get applied to selected favorites
                $scope.applyChanges(); //
                $scope.query = ''; //Set the filter string to null and hide the create label functionality
            };


            //Updates list of selected user user labels
            $scope.setSelectedItem = function(labelname){
                console.log("in setSElectedItem");
                $scope.updatesNecessary = true;  //Update view to show "Apply changes functionality"
                if(!labelname) { //sometimes label names are passed into this function
                    labelname = this.label.name; //sometimes this function is called by the model
                }
                if (_.contains($scope.selectedlabels, labelname)) { //If the label is already checked
                    $scope.selectedlabels = _.without($scope.selectedlabels, labelname); //uncheck the label
                } else { //label is not checked
                    $scope.selectedlabels.push(labelname); //check the label
                }
            };

            //Adds or removes label from each selected favorite
            $scope.applyChanges = function(){
                var currentFavorites = $scope.currentFaves; //get all the users favorited items

                console.log('looping thought selected faves', $scope.selectedfaves);

                angular.forEach($scope.selectedfaves, function(selectedStatus, id) { //loop through all the favorites and find the ones that are checked
                    if(selectedStatus) {  //Make sure the favorite is checked
                        console.log('this item selected', selectedStatus, id);
                        for(i=0; i<currentFavorites.length; i++){ //loop through each favorites metadata
                            if(currentFavorites[i].external_id == id){  //Match the id of checked favorite and get the rest of metadata from localstorage
                                console.log(currentFavorites[i].external_id, id);
                                currentFavorites[i].labels = $scope.selectedlabels;  //Applies all the checked user labels to the favorite TODO: We should not overwrite all the labels but instead add or remove them
                            }
                        }
                    }
                });

                favesFactory.updateFavorites(currentFavorites);
                //TODO:Select all should only select items on screen.  Not items hidden from filter

                $scope.selectedfaves = {}; //uncheck all the selected favorites from the view
                $scope.updatesNecessary = false; //Hide the apply button from the user labels drop down
            };


            //Deletes the label from the user list and removes the label from any favorite that has it applied
            $scope.deleteLabel = function($event){
                $event.stopPropagation();
                var labelname = this.label.name;
                var labelToRemove = {name : labelname};
                favesFactory.removeFavoriteLabel(labelToRemove, $scope.refreshTable);
            };

            $scope.refreshTable = function(){
                $scope.userlabels = favesFactory.getUserLabels();
                favesFactory.refreshTable();
            };


            //toggles checkmark next to user label
            $scope.isChecked = function (labelname) {
                if (_.contains($scope.selectedlabels, labelname)) { //check if toggle label is already in list of selected labels
                    return 'fa fa-check pull-right';
                }
                return false;
            };
        }]
    }
}]);