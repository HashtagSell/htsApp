/**
 * Created by braddavis on 11/29/14.
 */
htsApp.controller('settings.general.controller', ['$scope', '$timeout', 'Session', function ($scope, $timeout, Session) {
    //alert("general settings");

    $scope.options = {
        safeSearch: ['On', 'Off'],
        defaultEmail: ['Ask', 'Gmail', 'Yahoo', 'Hotmail', 'AOL'],
        location: ['Approximate', 'Exact']
    };



    $scope.getSafeSearch = function(){
        //var value = Session.getSessionValue('safe_search');
        if (Session.userObj.user_settings.safe_search){
            return $scope.options.safeSearch[0];
        } else {
            return $scope.options.safeSearch[1];
        }
    };
    $scope.safeSearch = $scope.getSafeSearch();
    $scope.setSafeSearch = function(selection){

        if(selection == "On"){
            Session.setSessionValue('safe_search', true, function(){
                $scope.safeSearchUpdated = true;

                $timeout(function () {

                    $scope.safeSearchUpdated = false;
                }, 3000);
            });
        } else if (selection == "Off") {
            Session.setSessionValue('safe_search', false, function(){
                $scope.safeSearchUpdated = true;

                $timeout(function () {

                    $scope.safeSearchUpdated = false;
                }, 3000);
            });
        }

    };


    $scope.getDefaultEmail = function(){
        //var value = Session.getSessionValue('email_provider');
        switch (Session.userObj.user_settings.email_provider) {
            case 'Ask':
                return $scope.options.defaultEmail[0];
            case 'Gmail':
                return $scope.options.defaultEmail[1];
            case 'Yahoo':
                return $scope.options.defaultEmail[2];
            case 'Hotmail':
                return $scope.options.defaultEmail[3];
            case 'AOL':
                return $scope.options.defaultEmail[4];
        }
    };
    $scope.defaultEmail = $scope.getDefaultEmail();

    $scope.setDefaultEmail = function(selection){

      Session.setSessionValue('email_provider', selection, function () {
          $scope.defaultEmailUpdated = true;

          $timeout(function () {

              $scope.defaultEmailUpdated = false;
          }, 3000);
      });

    };



    $scope.getLocation = function(){
        //var value = Session.getSessionValue('location_type');
        switch (Session.userObj.user_settings.location_type) {
            case 'Approximate':
                return $scope.options.location[0];
            case 'Exact':
                return $scope.options.location[1];
        }
    };
    $scope.location = $scope.getLocation();
    $scope.setLocation = function(selection){
        Session.setSessionValue('location_type', selection, function(){
            $scope.locationUpdated = true;

            $timeout(function () {

                $scope.locationUpdated = false;
            }, 3000);
        });
    };

}]);