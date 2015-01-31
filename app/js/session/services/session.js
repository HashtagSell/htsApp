//This service is getter and setter for user settings, favorites, logged in status etc.
htsApp.service('Session', ['$window', '$http', '$q', '$state', 'socketio', function ($window, $http, $q, $state, socketio) {

    this.defaultUserObj = {
        loggedIn: false,
        profile_photo: '/images/userMenu/user-placeholder.png',
        banner_photo: '/images/userMenu/header-placeholder.png',
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

    //if the user refreshes the app or opens app back up and user is still logged in then we join all their rooms.
    //if($window.localStorage.hts_storage){
    //    this.userObj = {
    //        user_settings : JSON.parse($window.localStorage.getItem("hts_storage"))
    //    };
    //    socketio.username = this.userObj.user_settings.name;
    //    socketio.init();
    //} else {
    //    this.userObj = {
    //        user_settings : this.defaultUserObj
    //    };
    //}

    if($window.localStorage.hts_storage){
        socketio.username = this.userObj.user_settings.name;
        socketio.init();
    }


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
        console.log('Updating local storage with ',data);
        data.user_settings.loggedIn = true;
        this.userObj.user_settings = data.user_settings; //ONLY ADD USER_SETTING PROPERTY TO OBJECT OTHERWISE BINDING FAILS AND UI DOES NOT LIVE UPDATE.
        console.log('data about to be written to local storage', this.userObj);

        if(!$window.localStorage.hts_storage){
            console.log('this is first login. Init socket.io to all rooms of items they are selling');
            // init to tell server who client is
            socketio.username = this.userObj.user_settings.name;
            socketio.init();
        }

        $window.localStorage.hts_storage = angular.toJson(this.userObj.user_settings);
    };

    //Clears all users settings from HTML5 session storage on logout
    this.destroy = function () {
        console.log('clearing user obj');
        this.userObj.user_settings = this.defaultUserObj;

        console.log('destroying all socket.io connections');
        socketio.closeAllConnections();

        console.log("Destroying HTML5 Session");
        $window.localStorage.removeItem("hts_storage");

        $state.go('feed');
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