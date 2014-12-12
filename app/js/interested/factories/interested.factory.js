htsApp.factory('favesFactory', ['Session', '$window', 'sideNavFactory', function (Session, $window, sideNavFactory) {

    //Init favesFactory Object
    var favesFactory = {};

    //Get the users current favorites
    favesFactory.currentFavorites = Session.userObj.user_settings.favorites;


    //Takes in a item and adds it to users favorites list or removes if already there
    favesFactory.addFave = function (item, callback) {

        Session.userObj.user_settings.favorites.push(item);

        Session.setSessionValue("favorites", Session.userObj.user_settings.favorites, callback);

        //Update the badge on the default side menu
        sideNavFactory.defaultMenu[2].alerts = Session.userObj.user_settings.favorites.length;

    };


    favesFactory.removeFave = function (item, callback) {
        var currentFavorites = Session.userObj.user_settings.favorites;

        //We use this array to store index of items that user may have ALREADY favorited
        var matchingIndexes = [];

        //If the new favorite's ID matching an existing favorite then note the index of that item
        _.some(currentFavorites, function(oldFav) {
            if(oldFav.external_id == item.external_id){
                matchingIndexes.push(currentFavorites.indexOf(oldFav));
            }
        });

        //If we have index of matching item then remove the favorite.  If we do not have index of existing favorite than add it.
        if(matchingIndexes.length > 0){
            //for(i=0; i<matchingIndexes.length; i++){
                currentFavorites.splice(matchingIndexes[0],1);
            //}

            Session.setSessionValue("favorites", currentFavorites, callback);
        }

        //Update the badge on the default side menu
        sideNavFactory.defaultMenu[2].alerts = Session.userObj.user_settings.favorites.length;
    };


    favesFactory.checkFave = function (item, callback) {
        var currentFavorites = Session.userObj.user_settings.favorites;

        //We use this array to store index of items that user may have ALREADY favorited
        var matchingIndexes = [];

        //If the new favorite's ID matching an existing favorite then note the index of that item
        _.some(currentFavorites, function(oldFav) {
            if(oldFav.external_id == item.external_id){
                matchingIndexes.push(currentFavorites.indexOf(oldFav));
            }
        });

        //If we have index of matching item then remove the favorite.  If we do not have index of existing favorite than add it.
        if(matchingIndexes.length > 0){
            callback(true);
        } else {
            callback(false);
        }
    };


    //Refreshes ng-table in the favorites pane
    favesFactory.refreshTable = function(){
        console.log("refreshing favorites table");
        //favesFactory.currentFavorites = Session.getSessionValue('favorites');
        favesFactory.tableParams.reload();
    };

    favesFactory.getFavesCount = function () {
      return Session.userObj.user_settings.favorites.length;
    };


    favesFactory.updateFavorites = function(updatedFavorites) {
        console.log("setting favorite");
        console.log(updatedFavorites);

        //var currentFavorites = Session.userObj.user_settings.favorites;
        //
        ////Used to store index of item existing fave in db
        //var faveIndex = null;
        //
        ////If the new favorite's ID matching an existing favorite then note the index of that item
        //_.some(currentFavorites, function(oldFav) {
        //    if(oldFav.id == updatedFav.id){
        //        faveIndex = currentFavorites.indexOf(oldFav);
        //    }
        //});
        //
        ////If we have index of matching item than remove the favorite.  If we do not have index of existing favorite than add it.
        //
        //currentFavorites.splice(faveIndex,1, updatedFav);

        Session.setSessionValue('favorites', updatedFavorites);
    };


    favesFactory.filterString = '';


    favesFactory.batchRemoveFaves = function(checkedItems){
        console.log(checkedItems);
        angular.forEach(checkedItems.items, function(checked, id) {
            console.log("checked: ", checked, "id: ", id);
            if(checked) {
                var tempObj = {};
                tempObj.external_id = id;
                favesFactory.removeFave(tempObj, function () {
                    favesFactory.refreshTable();
                });
            }
        });
    };

    //Get the email addresses associated with the IDs of the selected favorites.  This is a dumb way to do it.  Fix this Brad.
    favesFactory.batchEmail = function(checkedItems){
        var currentFavorites = Session.userObj.user_settings.favorites;

        var bccList = [];

        angular.forEach(checkedItems.items, function(checked, id) {
            if(checked) {  //Make sure the item is checked
                for(i=0; i<currentFavorites.length; i++){
                    if(currentFavorites[i].external_id == id){  //Using the ID of the checked item grab the email, heading, and other meta data from local storage.
                        if(currentFavorites[i].annotations.source_account !== "undefined") { //Make sure the matching item in local storage has an email
                            bccList.push({email: currentFavorites[i].annotations.source_account, heading: currentFavorites[i].heading, url: "HashtagSell.com - Re-thinking Online Classifieds"});
                        }
                    }
                }
            }
        });

        console.log(bccList);

        if(bccList.length === 0){ //Inform the user none of the selected favorites have email address we can email
            alert("These favorited items have no emails.");
        } else if (bccList.length == 1){ //Don't send to batchEmail function if we only have one email
            //quickComposeFactory.init(bccList[0]);
        } else {
            //quickComposeFactory.batchEmail(bccList); //Send batch email
        }
    };


    favesFactory.addFavoriteLabel = function(newLabel){
        var sessionObj = Session.userObj;

        if(!sessionObj.user_settings.user_labels){ //user_labels was not part of original schema.  This protorypes array if doesn't exist.
            sessionObj.user_settings.user_labels = [];
        }

        sessionObj.user_settings.user_labels.push(newLabel);
        Session.setSessionValue("user_labels", sessionObj.user_settings.user_labels);
    };

    favesFactory.removeFavoriteLabel = function(labelToRemove, callback){
//        Session.removeFavoriteLabel(labelToRemove, callback);

        var sessionObj = Session.userObj; //Get entire session object
        sessionObj.user_settings.user_labels = _.without(sessionObj.user_settings.user_labels, _.findWhere(sessionObj.user_settings.user_labels, labelToRemove)); //find the user label and remove it from session object


        Session.setSessionValue("user_labels", sessionObj.user_settings.user_labels); //Remove user label from server

        var cleanFavorites = [];  //Temporarily store the users favorites with the label removed from all items

        _.each(sessionObj.user_settings.favorites, function(favorite) {
            favorite.labels = _.without(favorite.labels, _.findWhere(favorite.labels, labelToRemove.name));  //loop through all the users favorites and remove the label each item
            cleanFavorites.push(favorite);
        });

        sessionObj.user_settings.favorites = cleanFavorites;

        Session.setSessionValue("favorites", sessionObj.user_settings.favorites, callback);
    };

    favesFactory.getUserLabels = function(){
        return Session.getSessionValue("user_labels");
    };


    return favesFactory;

}]);