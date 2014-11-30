//This service is getter and setter for user settings, favorites, logged in status etc.
htsApp.service('Session', ['$window', '$http', '$q', function ($window, $http, $q) {

    //Call this function when user updates HTML5 Session Storage.  Keeps server in sync.
    this.updateServer = function (callback) {

        var userSettingsObject = this.getSessionObj();

        var deferred = $q.defer();

        console.log("posting to /updateUserSettings");
        $http.post('/updateUserSettings', { "userSettings": userSettingsObject})

            .then(function (response) {

                if (response.data.success) {

                    deferred.resolve();
                    console.log("here is our response from server", response);
                    console.log("CHECKING IF WE HAVE CALLBACK");
                    if (callback) {
                        console.log("NOW WE SHOULD UPDATE TABLE!!");
                        callback();

                    }

                } else {

                    console.log(response);
                }
            },            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    //AwesomeBar Controllers bind to this to update view
    this.currentLoginStatus = {value: false};

    //Adds all users setting to HTML5 session storage
    this.create = function (data) {
        console.log("Creating HTML5 Session");
        console.log(data);
        $window.localStorage.hts_storage = angular.toJson(data.user_settings);
        this.getLoginStatus();
    };

    //Clears all users settings from HTML5 session storage on logout
    this.destroy = function () {
//        console.log("Destroying HTML5 Session");
        $window.localStorage.removeItem("hts_storage");
    };

    //Get the current login status of the user
    this.getLoginStatus = function (blah) {
//        this.validateSession();

//        console.log(blah);
        this.currentLoginStatus.value = !!$window.localStorage.hts_storage;
        return !!$window.localStorage.hts_storage;
    };

    //Get all the user setttings from HTML5 session storage
    this.getSessionObj = function () {
//        console.log("Get all user settings from HTML5 session");
        if (this.getLoginStatus()) {
            return JSON.parse($window.localStorage.getItem("hts_storage"));
        } else {
            return false
        }
    };

    //Get a particular user setting from HTML5 session storage
    this.getSessionValue = function (key) {
        console.log("get " + key + " from HTML5 user settings");
        var userObj = this.getSessionObj();
        if (userObj) {
            return userObj[key];
        } else {
            return false;
        }
    };

    //Set a particular user setting in HTML5 session storage then update the server
    this.setSessionValue = function (key, value, callback) {
        console.log("set " + key + " in HTML5 user settings to ", value);
        var userObj = this.getSessionObj();
        console.log("here is user obj", userObj);
        userObj[key] = value;
        var data = {};
        data.user_settings = userObj;
        this.create(data);
        this.updateServer(callback);
    };


    this.addFaveToSession = function (fave, callback) {
        var userObj = this.getSessionObj();
        console.log("here is user obj", userObj);
        userObj.favorites.push(fave);
        var data = {};
        data.user_settings = userObj;
        this.create(data);
        this.updateServer(callback);
    };


    return this;
}]);