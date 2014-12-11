//This service is getter and setter for user settings, favorites, logged in status etc.
htsApp.service('Session', ['$window', '$http', '$q', function ($window, $http, $q) {

    this.userObj = {
        user_settings : JSON.parse($window.localStorage.getItem("hts_storage")) || {
            loggedIn: false,
            profile_photo: '/images/userMenu/user-placeholder.png',
            profile_header: '/images/userMenu/header-placeholder.gif',
            favorites: []
        }
    };

    //Call this function when user updates HTML5 Session Storage.  Keeps server in sync.
    this.updateServer = function (callback) {

        console.log("updating server");

        var deferred = $q.defer();

        $http.post('/updateUserSettings', { "userSettings": this.userObj.user_settings})

            .then(function (response) {

                if (response.data.success) {

                    deferred.resolve();
                    if (callback) {
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

    //Adds all users setting to HTML5 session storage
    this.create = function (data) {
        console.log('Updating local storage with ',data);
        data.user_settings.loggedIn = true;
        this.userObj.user_settings = data.user_settings; //ONLY ADD USER_SETTING PROPERTY TO OBJECT OTHERWISE BINDING FAILS AND UI DOES NOT LIVE UPDATE.
        console.log('data about to be written to local storage', this.userObj);
        $window.localStorage.hts_storage = angular.toJson(this.userObj.user_settings);
    };

    //Clears all users settings from HTML5 session storage on logout
    this.destroy = function () {
        console.log("Destroying HTML5 Session");
        $window.localStorage.removeItem("hts_storage");
    };


    //Get all the user setttings from HTML5 session storage
    this.getSessionObj = function () {
//        console.log("Get all user settings from HTML5 session");

        this.userObj.loggedIn = !!$window.localStorage.hts_storage;

        if (this.userObj.loggedIn) {
            this.userObj = JSON.parse($window.localStorage.getItem("hts_storage"));
            this.userObj.loggedIn = !!$window.localStorage.hts_storage;
            return this.userObj;
        } else {
            this.userObj.loggedIn = !!$window.localStorage.hts_storage;
            this.userObj.profile_header = "/images/userMenu/header-placeholder.gif";
            this.userObj.profile_photo = "/images/userMenu/user-placeholder.png";
            return this.userObj;
        }
    };

    //Get a particular user setting from HTML5 session storage
    this.getSessionValue = function (key) {
        if (this.userObj.user_settings[key]) {
            return this.userObj.user_settings[key];
        } else {
            return false;
        }
    };

    //Set a particular user setting in HTML5 session storage then update the server
    this.setSessionValue = function (key, value, callback) {
        console.log("set " + key + " in HTML5 user settings to ", value);
        this.userObj.user_settings[key] = value;
        this.create(this.userObj);
        this.updateServer(callback);
    };


    return this;
}]);