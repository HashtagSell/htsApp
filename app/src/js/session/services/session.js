//This service is getter and setter for user settings, favorites, logged in status etc.
htsApp.service('Session', ['$window', '$http', '$q', '$state', function ($window, $http, $q, $state) {

    this.defaultUserObj = {
        loggedIn: false,
        profile_photo: '//static.hashtagsell.com/htsApp/placeholders/user-placeholder.png',
        banner_photo: '//static.hashtagsell.com/htsApp/placeholders/header-placeholder.png',
        safe_search: true,
        linkedAccounts: [],
        email_provider: [
            {
                name : "Always Ask",
                value: "ask"
            }
        ],
        favorites: [],
        feed_categories:[{
            "code": "SSSS",
            "name": "For Sale",
            "categories": [{
                "code": "SANT",
                "name": "Antiques",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SAPP",
                "name": "Apparel",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SAPL",
                "name": "Appliances",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SANC",
                "name": "Art And Crafts",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SKID",
                "name": "Babies And Kids",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SBAR",
                "name": "Barters",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SBIK",
                "name": "Bicycles",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SBIZ",
                "name": "Businesses",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SCOL",
                "name": "Collections",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SEDU",
                "name": "Educational",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SELE",
                "name": "Electronics And Photo",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SFNB",
                "name": "Food And Beverage",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SFUR",
                "name": "Furniture",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SGAR",
                "name": "Garage Sales",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SGFT",
                "name": "Gift Cards",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SHNB",
                "name": "Health And Beauty",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SHNG",
                "name": "Home And Garden",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SIND",
                "name": "Industrial",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SJWL",
                "name": "Jewelry",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SLIT",
                "name": "Literature",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SMNM",
                "name": "Movies And Music",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SMUS",
                "name": "Musical Instruments",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SRES",
                "name": "Restaurants",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SSNF",
                "name": "Sports And Fitness",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "STIX",
                "name": "Tickets",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "STOO",
                "name": "Tools",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "STOY",
                "name": "Toys And Hobbies",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "STVL",
                "name": "Travel",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SWNT",
                "name": "Wanted",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "SOTH",
                "name": "Other",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }],
            "selected": true,
            "__ivhTreeviewIndeterminate": false,
            "__ivhTreeviewExpanded": true
        }, {
            "code": "RRRR",
            "name": "Real Estate",
            "categories": [{
                "code": "RCRE",
                "name": "Commercial Real Estate",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RHFR",
                "name": "Housing For Rent",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RHFS",
                "name": "Housing For Sale",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RSUB",
                "name": "Housing Sublets",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RSWP",
                "name": "Housing Swaps",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RLOT",
                "name": "Lots And Land",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RPNS",
                "name": "Parking And Storage",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RSHR",
                "name": "Room Shares",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RVAC",
                "name": "Vacation Properties",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "RWNT",
                "name": "Want Housing",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "ROTH",
                "name": "Other",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }],
            "selected": true,
            "__ivhTreeviewIndeterminate": false,
            "__ivhTreeviewExpanded": true
        }, {
            "code": "VVVV",
            "name": "Vehicles",
            "categories": [{
                "code": "VAUT",
                "name": "Autos",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "VMOT",
                "name": "Motorcycles",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "VMPT",
                "name": "Motorcycle Parts",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "VPAR",
                "name": "Parts",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }, {
                "code": "VOTH",
                "name": "Other",
                "selected": true,
                "__ivhTreeviewExpanded": false,
                "__ivhTreeviewIndeterminate": false
            }],
            "selected": true,
            "__ivhTreeviewIndeterminate": false,
            "__ivhTreeviewExpanded": true
        }]
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


    this.deleteAccount = function () {

        var deferred = $q.defer();

        $http({
            url: '/user',
            method: 'DELETE'
        }).then(function (response) {

                deferred.resolve(response);

            },            //error
            function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;

    };


    return this;
}]);