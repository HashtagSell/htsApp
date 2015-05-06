//This service is getter and setter for user settings, favorites, logged in status etc.
htsApp.service('Session', ['$window', '$http', '$q', '$state', function ($window, $http, $q, $state) {

    this.defaultUserObj = {
        loggedIn: false,
        profile_photo: '//static.hashtagsell.com/htsApp/placeholders/user-placeholder.png',
        banner_photo: '//static.hashtagsell.com/htsApp/placeholders/header-placeholder.png',
        safe_search: true,
        email_provider: [
            {
                name : "Always Ask",
                value: "ask"
            }
        ],
        favorites: [],
        feed_categories:[
            {
                "name" : "Real Estate",
                "code" : "RRRR"
            },
            {
                "name" : "For Sale",
                "code" : "SSSS"
            },
            {
                "name" : "Vehicles",
                "code" : "VVVV"
            }
        ]
    };


    this.userObj = {
        user_settings : JSON.parse($window.localStorage.getItem("hts_storage")) || this.defaultUserObj
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
                        callback(response);
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
        console.log('Updating local storage with', data);
        data.user_settings.loggedIn = true;
        this.userObj.user_settings = data.user_settings; //ONLY ADD USER_SETTING PROPERTY TO OBJECT OTHERWISE BINDING FAILS AND UI DOES NOT LIVE UPDATE.

        console.log('data about to be written to local storage', this.userObj);

        $window.localStorage.hts_storage = angular.toJson(this.userObj.user_settings);
    };

    //Clears all users settings from HTML5 session storage on logout
    this.destroy = function () {
        console.log('clearing user obj');
        this.userObj.user_settings = this.defaultUserObj;

        console.log("Destroying HTML5 Session");
        $window.localStorage.removeItem("hts_storage");

        $state.go('feed');
    };

    //Get a particular user setting from HTML5 session storage
    this.getSessionValue = function (key) {
        if (this.userObj.user_settings[key]) {
            return this.userObj.user_settings[key];
        }else if (this.userObj.user_settings.linkedAccounts[key]) {
            return this.userObj.user_settings.linkedAccounts[key];
        } else {
            return false;
        }
    };

    //Set a particular user setting in HTML5 session storage then update the server
    this.setSessionValue = function (key, value, callback) {
        console.log("set " + key + " in HTML5 user settings to ", value);

        if (this.userObj.user_settings[key]) {
            this.userObj.user_settings[key] = value;
        } else if (this.userObj.user_settings.linkedAccounts[key]) {
            this.userObj.user_settings.linkedAccounts[key] = value;
        }

        this.create(this.userObj);
        this.updateServer(callback);
    };


    this.getUserFromServer = function () {

        var deferred = $q.defer();

        $http.get('/getUserSettings')

            .then(function (response) {

                var data = {};
                data.user_settings = response.data;

                deferred.resolve(data);

            },            //error
            function (data, status, headers, config) {
                deferred.reject();
            });

        return deferred.promise;
    };


    return this;
}]);