/**
 * Created by braddavis on 4/7/15.
 */
htsApp.directive('dropdownMultiselect', ['favesFactory', function (favesFactory){
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
        template: "<span class='dropdown' dropdown>"+
        "<i class='fa fa-tags dropdown-toggle' dropdown-toggle ng-click='open=!open;openDropdown()'>&nbsp;&nbsp;#Label</i>"+
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
                            if(currentFavorites[i].postingId == id && currentFavorites[i].labels){  //Using the ID of the checked item grab the email, heading, and other meta data from local storage.

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
                    unique = false; //don't show create label
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
                            if(currentFavorites[i].postingId == id){  //Match the id of checked favorite and get the rest of metadata from localstorage
                                console.log(currentFavorites[i].postingId, id);
                                currentFavorites[i].labels = $scope.selectedlabels;  //Applies all the checked user labels to the favorite TODO: We should not overwrite all the labels but instead add or remove them
                            }
                        }
                    }
                });

                Session.setSessionValue('favorites', currentFavorites);
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
    };
}]);