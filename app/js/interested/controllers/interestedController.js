/**
 * Created by braddavis on 10/29/14.
 */
htsApp.controller('myFavesController', ['$scope', '$window', 'favesFactory', function($scope, $window, favesFactory) {

    //This value evaluated in results.ejs to toggle show/hide favorites class
    $scope.showFaves = favesFactory.uiToggleStatus;

    //Sets up ng-table params
    $scope.tableParams = favesFactory.tableParams;

    // Ugh... http://stackoverflow.com/questions/22892908/ng-table-typeerror-cannot-set-property-data-of-null
    $scope.tableParams.settings().$scope = $scope;

    //Called when user clicks on remove button next to favorite
    $scope.removeFave = function(item){
        favesFactory.addRemoveFave(item);
    };

    //Called when user clicks on item in their favorites
    $scope.openItemInTab = function(favoriteItem){
        favesFactory.detailedView(favoriteItem);
    };

    //Uncheck all the checkboxes by default
    $scope.checkboxes = { checked : false, items: {} };


    // watch for data checkboxes
    $scope.$watch('checkboxes.items', function(values) {
        if (!favesFactory.currentFavorites) {
            return;
        }
        var checked = 0, unchecked = 0;
        totalFaves = favesFactory.currentFavorites.length;
        angular.forEach(favesFactory.currentFavorites, function(favorite) {
            checked   +=  ($scope.checkboxes.items[favorite.id]) || 0;
            unchecked += (!$scope.checkboxes.items[favorite.id]) || 0;
        });
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
        angular.forEach(favesFactory.currentFavorites, function(favorite) {
            if (angular.isDefined(favorite.id)) {
                $scope.checkboxes.items[favorite.id] = value;
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

}]);


htsApp.factory('favesFactory', ['Session', '$filter', '$window', 'ngTableParams', function(Session, $filter, $window, ngTableParams){

    //Init favesFactory Object
    var favesFactory = {};

    //Main.js evaluates this value to determine if favorites are on expanded or not
    favesFactory.uiToggleStatus = {value : false};

    //Get the users current favorites
    favesFactory.currentFavorites = Session.getSessionValue('favorites');

    //Shows & Hides the favorites module from the view
    favesFactory.toggleFavesUI = function(checkedItems){
        favesFactory.uiToggleStatus.value = !favesFactory.uiToggleStatus.value;
        //TODO UNCHECK ALL FAVES AND SET QUERY TO NULL
        return favesFactory.uiToggleStatus.value
    };


    //Takes in a item and adds it to users favorites list or removes if already there
    favesFactory.addRemoveFave = function(item) {
        console.log("setting favorite");
        console.log(item);

        var currentFavorites = favesFactory.currentFavorites;

        //We use this array to store index of items that user may have ALREADY favorited
        var matchingIndexes = [];

        //If the new favorite's ID matching an existing favorite then note the index of that item
        _.some(currentFavorites, function(oldFav) {
            if(oldFav.id == item.id){
                matchingIndexes.push(currentFavorites.indexOf(oldFav));
            }
        });

        //If we have index of matching item than remove the favorite.  If we do not have index of existing favorite than add it.
        if(matchingIndexes.length > 0){
            for(i=0; i<matchingIndexes.length; i++){
                currentFavorites.splice(matchingIndexes[i],1);
            }

            Session.setSessionValue("favorites", currentFavorites, favesFactory.refreshTable);

            return false
        } else {
            currentFavorites.push(item);

            console.log(currentFavorites);

            Session.setSessionValue("favorites", currentFavorites, favesFactory.refreshTable);

            return true
        }

        return error

    };


    //Refreshes ng-table in the favorites pane
    favesFactory.refreshTable = function(){
        console.log("refreshing favorites table");
        favesFactory.currentFavorites = Session.getSessionValue('favorites');
        favesFactory.tableParams.reload();
    };


    favesFactory.updateFave = function(updatedFav){
        console.log("setting favorite");
        console.log(updatedFav);

        var currentFavorites = favesFactory.currentFavorites;

        //Used to store index of item existing fave in db
        var faveIndex = null;

        //If the new favorite's ID matching an existing favorite then note the index of that item
        _.some(currentFavorites, function(oldFav) {
            if(oldFav.id == updatedFav.id){
                faveIndex = currentFavorites.indexOf(oldFav);
            }
        });

        //If we have index of matching item than remove the favorite.  If we do not have index of existing favorite than add it.

        currentFavorites.splice(faveIndex,1, updatedFav);

        Session.setSessionValue('favorites', currentFavorites);
    };


    //opens items url in javascript
    favesFactory.detailedView = function(favoriteItem){
        var url = "../post/?id="+favoriteItem.id+"&tier="+favoriteItem.tier+"&source="+favoriteItem.source;
        $window.open(url, '_blank');
    };


    favesFactory.filterString = '';

    //Setup table with heading filitering and price sort.  ng-table
    favesFactory.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 2000, // include all favorites on page one
        filter: {},         // initial filter
        sorting: {}         // initial sort
    }, {
        counts: [], //hides page sizes
        total: favesFactory.currentFavorites.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var filteredData = $filter('filter')(favesFactory.currentFavorites, favesFactory.filterString);
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });


    favesFactory.batchRemoveFaves = function(checkedItems){
        console.log(checkedItems);
        angular.forEach(checkedItems.items, function(checked, id) {
            if(checked) {
                favesFactory.addRemoveFave({id: id});
            }
        });
    };

    //Get the email addresses associated with the IDs of the selected favorites.  This is a dumb way to do it.  Fix this Brad.
    favesFactory.batchEmail = function(checkedItems){
        var currentFavorites = favesFactory.currentFavorites;

        var bccList = [];

        angular.forEach(checkedItems.items, function(checked, id) {
            if(checked) {  //Make sure the item is checked
                for(i=0; i<currentFavorites.length; i++){
                    if(currentFavorites[i].id == id){  //Using the ID of the checked item grab the email, heading, and other meta data from local storage.
                        if(currentFavorites[i].email !== "undefined") { //Make sure the matching item in local storage has an email
                            bccList.push({email: currentFavorites[i].email, heading: currentFavorites[i].heading, url: "HashtagSell.com - Re-thinking Online Classifieds"});
                        }
                    }
                }
            }
        });

        console.log(bccList);

        if(bccList.length == 0){ //Inform the user none of the selected favorites have email address we can email
            alert("These favorited items have no emails.")
        } else if (bccList.length == 1){ //Don't send to batchEmail function if we only have one email
            //quickComposeFactory.init(bccList[0]);
        } else {
            //quickComposeFactory.batchEmail(bccList); //Send batch email
        }
    };


    favesFactory.addFavoriteLabel = function(newLabel){
        var sessionObj = Session.getSessionObj();

        if(!sessionObj.user_labels){ //user_labels was not part of original schema.  This protorypes array if doesn't exist.
            sessionObj.user_labels = [];
        }

        sessionObj.user_labels.push(newLabel);
        Session.setSessionValue("user_labels", sessionObj.user_labels);
    };

    favesFactory.removeFavoriteLabel = function(labelToRemove, callback){
//        Session.removeFavoriteLabel(labelToRemove, callback);

        var sessionObj = Session.getSessionObj(); //Get entire session object
        sessionObj.user_labels = _.without(sessionObj.user_labels, _.findWhere(sessionObj.user_labels, labelToRemove)); //find the user label and remove it from session object


        Session.setSessionValue("user_labels", sessionObj.user_labels); //Remove user label from server

        var cleanFavorites = [];  //Temporarily store the users favorites with the label removed from all items

        _.each(sessionObj.favorites, function(favorite) {
            favorite.labels = _.without(favorite.labels, _.findWhere(favorite.labels, labelToRemove.name));  //loop through all the users favorites and remove the label each item
            cleanFavorites.push(favorite);
        });

        sessionObj.favorites = cleanFavorites;

        Session.setSessionValue("favorites", sessionObj.favorites, callback);
    };

    favesFactory.getUserLabels = function(){
        return Session.getSessionValue("user_labels");
    };


    return favesFactory;

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
        "<input ng-model='query' type='text' autofocus class='labels-input' placeholder='Filter or Create New Labels'/>" +
        "<li ng-repeat='label in userlabels | filter:query' class='label-list'><a ng-click='setSelectedItem()'><span ng-click='deleteLabel($event)' class='fa fa-minus-circle pull-left delete-label'></span>#{{label.name}}<span ng-class='isChecked(label.name)'><span/></a></li>" +
        "<li><a dropdown-toggle ng-click='createNewLabel(query)' ng-show='ifQueryUnique(query)'>{{query}} (create new)</a></li>" +
        "<li><a dropdown-toggle ng-click='applyChanges()' ng-show='updatesNecessary'>Apply</a></li>" +
        "</ul>" +
        "</span>" ,
        controller: ['$scope', 'favesFactory', function($scope, favesFactory){

            $scope.openDropdown = function(){

                $scope.selectedlabels = [];
                $scope.updatesNecessary = false; //Hide the apply button from the user labels drop down

                var currentFavorites = favesFactory.currentFavorites;

                angular.forEach($scope.selectedfaves, function(selected, id) {
                    if(selected) {  //Make sure the item is checked
                        for(i=0; i<currentFavorites.length; i++){
                            if(currentFavorites[i].id == id && currentFavorites[i].labels){  //Using the ID of the checked item grab the email, heading, and other meta data from local storage.

                                for(j=0; j<currentFavorites[i].labels.length; j++){
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
                favesFactory.addFavoriteLabel(newLabelObj); //hand new lable to faves factory for processing
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
                var currentFavorites = favesFactory.currentFavorites; //get all the users favorited items

                angular.forEach($scope.selectedfaves, function(selectedStatus, id) { //loop through all the favorites and find the ones that are checked
                    if(selectedStatus) {  //Make sure the favorite is checked
                        for(i=0; i<currentFavorites.length; i++){ //loop through each favorites metadata
                            if(currentFavorites[i].id == id){  //Match the id of checked favorite and get the rest of metadata from localstorage
                                currentFavorites[i].labels = $scope.selectedlabels;  //Applies all the checked user labels to the favorite TODO: We should not overwrite all the labels but instead add or remove them
                                favesFactory.updateFave(currentFavorites[i]); //pass each favorite to faves factory to update the server TODO: Send multiple favorites at once to create less database traffic
                                //TODO:Select all should only select items on screen.  Not items hidden from filter
                            }
                        }
                    }
                });
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
                    return 'icon-ok pull-right';
                }
                return false;
            };
        }]
    }
}]);