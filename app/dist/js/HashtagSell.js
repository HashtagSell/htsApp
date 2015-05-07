// _    _           _     _               _____      _ _
//| |  | |         | |   | |             / ____|    | | |
//| |__| | __ _ ___| |__ | |_ __ _  __ _| (___   ___| | |  ___ ___  _ __ ___
//|  __  |/ _` / __| '_ \| __/ _` |/ _` |\___ \ / _ \ | | / __/ _ \| '_ ` _ \
//| |  | | (_| \__ \ | | | || (_| | (_| |____) |  __/ | || (_| (_) | | | | | |
//|_|  |_|\__,_|___/_| |_|\__\__,_|\__, |_____/ \___|_|_(_)___\___/|_| |_| |_|
//                                  __/ |
//                                 |___/
//
//           This is where it all begins...

var htsApp = angular.module('htsApp', ['globalVars', 'ui.router', 'ct.ui.router.extras.core', 'ct.ui.router.extras.dsr', 'ui.bootstrap', 'mentio', 'ui.bootstrap-slider', 'frapontillo.bootstrap-switch', 'ngTable', 'uiGmapgoogle-maps', 'ivh.treeview', 'vs-repeat', 'ui.bootstrap.datetimepicker', 'ngSanitize', 'ui-notification', 'ezfb', 'slick', 'braintree-angular']);


//Forcing XHR requests via Angular $http (AJAX)
htsApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$tooltipProvider', 'ivhTreeviewOptionsProvider', '$locationProvider', 'ezfbProvider', 'ENV', function ($httpProvider, $stateProvider, $urlRouterProvider, $tooltipProvider, ivhTreeviewOptionsProvider, $locationProvider, ezfbProvider, ENV) {

    //Allows for async ajax calls to authentication apis
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    //Tells search engines and crawlers this site loads content dynamically
    $locationProvider.hashPrefix('!');


    //set locale of easy facebook angular module
    ezfbProvider.setLocale('en_US');

    ezfbProvider.setInitParams({
        // This is my FB app id
        appId: ENV.fbAppId,
        version: 'v2.1'
    });

    //Allows me to programatically show/hide popovers needed in tutorials
    $tooltipProvider.setTriggers({
        'show': 'hide'
    });


    //function assigned to routes that can only be accessed when user logged in
    var loginRequired = ['$q', 'Session', '$state', '$timeout', 'redirect', function ($q, Session, $state, $timeout, redirect) {
        var deferred = $q.defer();

        console.log('checking login!', Session.userObj);
        console.log('login Checker should redirect to', redirect);

        if (!Session.userObj.user_settings.loggedIn) {

            $timeout(function() {
                $state.go('signup', { 'redirect': redirect });
            });

            deferred.reject();

        } else {
            deferred.resolve();
        }

        return deferred.promise;

    }];


    var joinRoom = ['socketio', 'Session', '$stateParams', 'splashFactory', function (socketio, Session, $stateParams, splashFactory) {
       if (Session.userObj.user_settings.loggedIn) {
           socketio.joinPostingRoom($stateParams.id, 'toggleSplash');

           //TODO: This is running before we have any data in factory.
           if(splashFactory.result) {
               if (splashFactory.result.external.source === 'HSHTG') {

                   var postingOwner = splashFactory.result.username;

                   socketio.joinUserRoom(postingOwner, Session.userObj.user_settings.name);
               }
           }
       }
    }];

    var leaveRoom = ['socketio', 'Session', '$stateParams', 'splashFactory', function (socketio, Session, $stateParams, splashFactory) {
        if (Session.userObj.user_settings.loggedIn) {
            socketio.leavePostingRoom($stateParams.id, 'toggleSplash');

            if(splashFactory.result) {
                if (splashFactory.result.external.source === 'HSHTG') {

                    var postingOwner = splashFactory.result.username;

                    socketio.leaveUserRoom(postingOwner);
                }
            }
        }
    }];



    $urlRouterProvider.otherwise(function($injector, $location){
        var state = $injector.get('$state');
        state.go('404');
        return $location.path();
    });


    $stateProvider.
        state('404', {
            views: {
                "root": {
                    templateUrl: 'js/404/partials/404.html'
                }
            }
        }).
        state('profile', {
            url: "/profile",
            templateUrl: 'js/profile/partials/profile.partial.html',
            controller: 'profile.controller',
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'profile';
                }
            }
        }).
        state('root', {
            url: "/",
            onEnter: function ($state) {
                $state.go('feed');
            }
        }).
        state('feed', {
            url: "/feed",
            templateUrl: "js/feed/partials/feed.partial.html",
            controller: "feed.controller",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'feed';
                }
            }
        }).
        state('feed.splash', {
            url: "/:id",
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom
        }).
        state('watchlist', {
            url: "/watchlist",
            templateUrl: "js/interested/partials/interested.html",
            controller: 'myFavesController',
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'watchlist';
                }
            }
        }).
        state('watchlist.questions', {
            url: "/questions/:postingId"
        }).
        state('watchlist.offers', {
            url: "/offers/:postingId"
        }).
        state('watchlist.splash', {
            url: "/:id",
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom
        }).
        state('notifications', {
            url: "/notifications",
            templateUrl: "js/notifications/partials/notifications.html",
            controller: 'notifications.controller',
            rresolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'notifications';
                }
            }
        }).
        state('myposts', {
            url: "/myposts",
            templateUrl: "js/myPosts/partials/myPosts.html",
            controller: 'myPosts.controller',
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'myposts';
                }
            }
        }).
        state('myposts.questions', {
            url: "/questions/:postingId"
        }).
        state('myposts.offers', {
            url: "/offers/:postingId"
        }).
        state('myposts.splash', {
            url: "/:id",
            controller: 'splashController'
        }).
        state('settings', {
            url: "/settings",
            templateUrl: "js/settings/settings_partial.html",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'settings';
                }
            }
        }).
        state('settings.account', {
            url: "/account",
            templateUrl: "js/settings/account/partials/settings.account_partial.html",
            controller: "settings.account.controller"
        }).
        state('settings.password', {
            url: "/password",
            templateUrl: "js/settings/password/partials/settings.password_partial.html",
            controller: "settings.password.controller"
        }).
        state('settings.profile', {
            url: "/profile",
            templateUrl: "js/settings/profile/partials/settings.profile_partial.html",
            controller: "settings.profile.controller"
        }).
        state('settings.payment', {
            url: "/payment",
            templateUrl: "js/settings/payment/partials/settings.payment_partial.html",
            controller: "settings.payment.controller"
        }).
        state('results', {
            url: '/q/:q',
            params: {
                'q': null,
                'city': null,
                'locationObj': null
            },
            controller: 'results.controller',
            templateUrl: "js/results/partials/results_partial.html",
            resolve: {
                loginRequired: loginRequired,
                redirect: function () {
                    return 'results';
                }
            }
        }).
        state('results.splash', {
            url: "/:id",
            params: {
                'q': null,
                'city': null,
                'locationObj': null,
                'id': null
            },
            controller: 'splashController',
            onEnter: joinRoom,
            onExit: leaveRoom
        }).
        state('twitter', {
            url: "/tw/:id",
            controller: 'splashController'
        }).
        state('facebook', {
            url: "/fb/:id",
            controller: 'splashController'
        }).
        state('ebay', {
            url: "/eb/:id",
            controller: 'splashController'
        }).
        state('amazon', {
            url: "/az/:id",
            controller: 'splashController'
        }).
        state('signin', {
            url: '/signin?email&tour',
            params: {
                'redirect': null,
                'email': null,
                'tour': null
            },
            controller: function(authModalFactory, $state) {
                console.log($state.params);
                authModalFactory.signInModal($state.params);
            }
        }).
        state('signup', {
            url: '/signup',
            params: { 'redirect': null },
            controller: function(authModalFactory, $state) {
                authModalFactory.signUpModal($state.params);
            }
        }).
        state('checkemail', {
            url: '/checkemail',
            params: { 'redirect': null },
            controller: function(authModalFactory, $state) {
                authModalFactory.checkEmailModal($state.params);
            }
        }).
        state('forgot', {
            url: '/forgot?msg',
            params: {
                'redirect': null,
                'msg': null
            },
            controller: function(authModalFactory, $state) {
                authModalFactory.forgotPasswordModal($state.params);
            }
        }).
        state('reset', {
            url: '/reset/:token/',
            controller: function(authModalFactory, $state) {
                authModalFactory.resetPasswordModal('signin', $state.params.token);
            }
        });



    ivhTreeviewOptionsProvider.set({
        twistieCollapsedTpl: '<span class="glyphicon glyphicon-chevron-right"></span>',
        twistieExpandedTpl: '<span class="glyphicon glyphicon-chevron-down"></span>',
        twistieLeafTpl: '',
        defaultSelectedState: false
    });
}]);


//Verifies is password field match
htsApp.directive('matchinput', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            matchinput: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(function () {
                return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.matchinput === ctrl.$modelValue;
            }, function (currentValue) {
                ctrl.$setValidity('match', currentValue);
            });
        }
    };
});


//Convert phone numbers 1234567891 -> (123) 456-7891
htsApp.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});



htsApp.filter('cleanHeading', ['$sce', function ($sce) {
    return function (dirtyHeading) {
        //Capitalize the first letter of every word
        return dirtyHeading.replace(/\w\S*/g, function (dirtyHeading) {

            //Test against regex expression to find items like integers followed by simicolon.  i.e. 5556;
            var integersAndSimicolon = new RegExp("\\S+([0-9];)");
            if(!integersAndSimicolon.test(dirtyHeading)) {

                var cleanedHeading = dirtyHeading.charAt(0).toUpperCase() + dirtyHeading.substr(1).toLowerCase();
                return $sce.trustAsHtml(cleanedHeading);

            } else {
                return '';
            }
        });
    };
}]);


htsApp.filter('cleanBody', ['$sce', function ($sce) {
    return function (dirtyBody) {

        dirtyBody = dirtyBody.replace(/[\r\n]/g, '<br />');

        //Find any word that is in ALL CAPS and only capitalize the first letter
        return dirtyBody.replace(/\b([A-Z]{2,})\b/g, function (dirtyBody) {

            //Test against regex expression to find items like integers followed by simicolon.  i.e. 5556;
            var integersAndSimicolon = new RegExp("\\S+([0-9];)");
            if (!integersAndSimicolon.test(dirtyBody)) {

                //TODO: Catch ↵ character and insert new line in html

                var cleanedBody = dirtyBody.charAt(0).toUpperCase() + dirtyBody.substr(1).toLowerCase();
                return $sce.trustAsHtml(cleanedBody);

            } else {
                return '';
            }
        });
    };
}]);


htsApp.filter('cleanBodyExcerpt', ['$sce', function ($sce) {
    return function (dirtyBody) {

        //Find any word that is in ALL CAPS and only capitalize the first letter
        return dirtyBody.replace(/\b([A-Z]{2,})\b/g, function (dirtyBody) {

            //Test against regex expression to find items like integers followed by simicolon.  i.e. 5556;
            var integersAndSimicolon = new RegExp("\\S+([0-9];)");
            if (!integersAndSimicolon.test(dirtyBody)) {

                //TODO: Catch ↵ character and insert new line in html

                var cleanedBody = dirtyBody.charAt(0).toUpperCase() + dirtyBody.substr(1).toLowerCase();
                return $sce.trustAsHtml(cleanedBody);

            } else {
                return '';
            }
        });
    };
}]);





htsApp.directive('awesomebar', ['$sce', function ($sce) {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {

            function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html === '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }

            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function () {
                console.log('doing this');
                if (ngModel.$viewValue !== element.html()) {
                    element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                }
            };

            // Listen for change events to enable binding
            element.on('keydown keyup', function (e) {
                //If the user pressed the enter key
                if(parseInt(e.which) === 13 && e.type === "keydown") {
                    //Check to see if the mentio menu is open or not
                    var mentioMenu = angular.element( document.querySelector( '#mentioMenu') );

                    if(mentioMenu[0].style.display === "none"){
                        console.log('mentio list closed.. submitting query');
                        scope.awesomeBarSubmit();
                    } else if(mentioMenu[0].style.display === "block") {
                        console.log('mentio list open');
                    }
                    e.preventDefault();
                } else {
                    scope.$apply(read);
                }
            });
            read(); // initialize
        }
    };
}]);




htsApp.directive('sellbox', ['$sce', '$window', function ($sce, $window) {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html === '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }

            if (!ngModel) return; // do nothing if no ng-model


            // Specify how UI should be updated
            ngModel.$render = function () {
                console.log('doing this');
                if (ngModel.$viewValue !== element.html()) {
                    element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                }
            };

            var oldValue = '';


            //Strips HTML from string.
            function strip(html){
                var tmp = document.createElement("DIV");
                tmp.innerHTML = html;
                return tmp.textContent || tmp.innerText || "";
            }


            //Load the js diff library
            var jsDiff = $window.JsDiff;
            var backspacePressed = false;


            scope.$watch('jsonObj.body', function(newValue, oldValue){

                console.log(backspacePressed);

                if(backspacePressed) {
                    backspacePressed = false;
                    console.log('==========Backspace Pressed==========');

                    var oldValueStripped = strip(oldValue);
                    var newValueStripped = strip(newValue);

                    console.log('Old Stripped', oldValueStripped);
                    console.log('New Stripped', newValueStripped);

                    //Run a diff
                    var diff = jsDiff.diffWords(oldValueStripped, newValueStripped);

                    if (diff.length) {

                        console.log(diff);

                        for (var i = 0; i < diff.length; i++) {
                            var excerpt = diff[i];
                            if (excerpt.removed) {
                                if (excerpt.value.indexOf('#') !== -1) {
                                    console.log('hasshtag removed ', excerpt.value);

                                    var hashtagToRemove = excerpt.value.replace('#', '');
                                    hashtagToRemove = hashtagToRemove.trim();

                                    scope.cleanModel("#", hashtagToRemove);
                                } else if (excerpt.value.indexOf('$') !== -1) {
                                    console.log('dollar removed ', excerpt.value);

                                    var priceTagToRemove = excerpt.value.replace('$', '');
                                    priceTagToRemove = priceTagToRemove.trim();

                                } else if (excerpt.value.indexOf('@') !== -1) {
                                    console.log('@ removed ', excerpt.value);

                                    var atTagToRemove = excerpt.value.replace('@', '');
                                    atTagToRemove = atTagToRemove.trim();
                                }
                            }
                        }
                    }
                }

            });


            // Listen for change events to enable binding
            element.on('keydown keyup', function (e) {

                if(parseInt(e.which) === 8 && e.type === "keydown") {
                    backspacePressed = true;
                    console.log('setting backspace pressed to true');
                }

                scope.$apply(read);
            });

            read(); // initialize
        }
    };
}]);





htsApp.directive('dropzone', function () {

    return {
        link: function ($scope, element, attrs) {
            var config, dropzone;

            console.log("dropzone scope:", $scope);

            // Disabling autoDiscover, otherwise Dropzone will try to attach twice.
            Dropzone.autoDiscover = false;

            config = $scope[attrs.dropzone];

            // create a Dropzone for the element with the given options
            dropzone = new Dropzone(element[0], config.options);

            // bind the given event handlers
            angular.forEach(config.eventHandlers, function (handler, event) {
                dropzone.on(event, handler);
            });

            config.init = function () {
                dropzone.processQueue();
            };
        }
    };
});



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



/**
 * Created by braddavis on 12/10/14.
 */
htsApp.directive('htsFaveToggle', function () {
    return {
        restrict: 'E',
        template: '<span ng-class="{starHighlighted: favorited, star: !favorited}" ng-click="toggleFave(result); $event.stopPropagation();" tooltip="{{tooltipMessage}}" tooltip-placement="right" tooltip-trigger="mouseenter"></span>',
        controller: ['$scope', '$element', 'favesFactory', 'Session', 'authModalFactory', 'socketio', 'sideNavFactory', '$timeout', function ($scope, $element, favesFactory, Session, authModalFactory, socketio, sideNavFactory, $timeout) {

            //console.log(Session.userObj);
            //
            if(Session.userObj.user_settings.loggedIn) {
                favesFactory.checkFave($scope.result, function (response) {
                    $scope.favorited = response;

                    $scope.tooltipMessage = 'please wait';

                    if($scope.favorited){
                        $scope.tooltipMessage = 'Remove from watchlist';
                    } else {
                        $scope.tooltipMessage = 'Add to watchlist';
                    }
                });
            }

            $scope.toggleFave = function (item) {
                if(Session.userObj.user_settings.loggedIn) {
                    console.log('favorited status: ', $scope.favorited);
                    console.log(item);
                    if (!$scope.favorited) { //If not already favorited
                        favesFactory.addFave(item, function () {  //Add the favorite and flag as done
                            sideNavFactory.defaultMenu[2].active = true;

                            $timeout(function () {
                                sideNavFactory.defaultMenu[2].active = false;
                            }, 250);

                            $scope.favorited = true;
                            $scope.tooltipMessage = 'Remove from watch list';
                            socketio.joinPostingRoom(item.postingId, 'inWatchList'); //Join the room of each posting the user owns.
                        });
                    } else { //toggle off favorite
                        favesFactory.removeFave(item, function () {
                            $scope.favorited = false;
                            $scope.tooltipMessage = 'Add to watch list';
                            socketio.leavePostingRoom(item.postingId, 'inWatchList'); //Join the room of each posting the user owns.

                        });
                    }
                } else {

                    authModalFactory.signInModal();

                }
                //console.log('bluring element', $element);
                //$element[0].childNodes[0].blur();
            };
        }]
    };
});


htsApp.filter('capitalize', function() {
    return function(input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    };
});
;angular.module('globalVars', [])

.constant('ENV', {name:'staging',htsAppUrl:'https://staging.hashtagsell.com',postingAPI:'https://staging-posting-api.hashtagsell.com/v1/postings/',userAPI:'https://staging-posting-api.hashtagsell.com/v1/users/',feedbackAPI:'https://staging.hashtagsell.com/feedback',braintreeAPI:'https://staging.hashtagsell.com/payments',realtimePostingAPI:'https://staging-realtime-svc.hashtagsell.com/v1/postings',realtimeUserAPI:'https://staging-realtime-svc.hashtagsell.com/v1/users',groupingsAPI:'https://staging-posting-api.hashtagsell.com/v1/groupings/',annotationsAPI:'https://staging-posting-api.hashtagsell.com/v1/annotations',facebookAuth:'https://staging.hashtagsell.com/auth/facebook',twitterAuth:'https://staging.hashtagsell.com/auth/twitter',ebayAuth:'https://staging.hashtagsell.com/auth/ebay',ebayRuName:'HashtagSell__In-HashtagS-e6d2-4-sdojf',ebaySignIn:'https://signin.sandbox.ebay.com/ws/eBayISAPI.dll',fbAppId:'459229800909426'})

.constant('clientTokenPath', 'https://staging.hashtagsell.com/payments/client_token')

;;/**
 * Created by braddavis on 12/10/14.
 */
htsApp.factory('authModalFactory', ['Session', '$modal', '$log', '$state', function (Session, $modal, $log, $state) {

    var factory = {};

    // =====================================
    // Spawns Sign In Modal ================
    // =====================================
    factory.signInModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: '/js/authModals/modals/signInModal/partials/signIn.html',
            controller: 'signInModalController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                params: function(){
                    return params;
                }
            }
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            console.log(reason);
            if(reason === "signUp") {
                $state.go('signup', {'redirect': params.redirect});
            } else if (reason === "forgot") {
                $state.go('forgot', {'redirect': params.redirect});
            } else if (reason === "signIn") {
                $state.go('signin', {'redirect': params.redirect});
            } else if (reason === "successful login" && params.redirect) {
                $state.go(params.redirect);
            }  else if (reason === "successful login" && !params.redirect) {
                $state.go('feed');
            }
            $log.info('Modal dismissed at: ' + new Date());
        });
    };





    // =====================================
    // Spawns Sign Up Modal ================
    // =====================================
    factory.signUpModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: '/js/authModals/modals/signUpModal/partials/signUp.html',
            controller: 'signupModalContainer',
            size: 'sm',
            keyboard: false,
            backdrop: 'static'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason === "success"){
                $state.go('checkemail');
            } else if (reason === "forgot") {
                $state.go('forgot', {'redirect': params.redirect});
            } else if (reason === "signIn") {
                $state.go('signin', {'redirect': params.redirect});
            }
            $log.info('Modal dismissed at: ' + new Date());
        });
    };




    // =====================================
    // Informs user to check email after password reset ================
    // =====================================
    factory.checkEmailModal = function () {

        var modalInstance = $modal.open({
            templateUrl: '/js/authModals/modals/checkEmailModal/partials/checkEmail.html',
            controller: 'checkEmailController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static'
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };



    // =====================================
    // Spawns Forgot Password Modal ================
    // =====================================
    factory.forgotPasswordModal = function (params) {

        var modalInstance = $modal.open({
            templateUrl: '/js/authModals/modals/forgotPasswordModal/partials/forgotPassword.html',
            controller: 'forgotPasswordController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                params: function () {
                    return params;
                }
            }
        });

        modalInstance.result.then(function (reason) {

        }, function (reason) {
            if(reason === "success"){
                $state.go('checkemail');
            } else if (reason === "signUp") {
                $state.go('signup', {'redirect': params.redirect});
            } else if (reason === "signIn") {
                $state.go('signin', {'redirect': params.redirect});
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

    };


    // =====================================
    // User can change their password in settings once they're logged in ================
    // =====================================
    //factory.updatePasswordModal = function () {
    //
    //    var modalInstance = $modal.open({
    //        templateUrl: '/js/authModals/modals/updatePasswordModal/partials/updatePassword.html',
    //        controller: 'updatePasswordModalController',
    //        size: 'sm'
    //    });
    //
    //    modalInstance.result.then(function (reason) {
    //
    //    }, function (reason) {
    //        console.log(reason);
    //
    //        $log.info('Modal dismissed at: ' + new Date());
    //    });
    //
    //};




    // =====================================
    // User can change their if they're not logged in using email recovery token ================
    // =====================================
    factory.resetPasswordModal = function (redirect, token) {

        var modalInstance = $modal.open({
            templateUrl: '/js/authModals/modals/resetPasswordModal/partials/resetPassword.html',
            controller: 'resetPasswordModalController',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                token: function () {
                    return token;
                }
            }
        });

        modalInstance.result.then(function (response) {

        }, function (response) {
            console.log(response);
            if(response.success) {
                $state.go('signin', {'redirect': 'feed', email: response.email});
            }
            $log.info('Modal dismissed at: ' + new Date());
        });

    };



    //factory.facebookAuthModal = function () {
    //
    //    var modalInstance = $modal.open({
    //        templateUrl: '/js/authModals/modals/facebookAuthModal/partials/facebookAuth.html',
    //        controller: 'facebookAuthController'
    //    });
    //
    //    modalInstance.result.then(function (reason) {
    //
    //    }, function (reason) {
    //        $log.info('Modal dismissed at: ' + new Date());
    //    });
    //};



    return factory;
}]);;//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('checkEmailController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);;//Controller catches forgot password process from the forgot password modal and passes it to our authFactory
htsApp.controller('forgotPasswordController', ['$scope', '$modalInstance', 'authFactory', 'params', function ($scope, $modalInstance, authFactory, params) {

    if(params.msg) {
        $scope.message = "This activation email link has already been used.  Sign in or reset your password.";
    }

    $scope.forgotPassword = function (isValid) {
        if (isValid) {
            var email = $scope.email;

            authFactory.passwordReset(email).then(function (response) {

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("success");

                }

            }, function () {

                $scope.message = "Please contact support.  Sorry for the trouble";

            });
        }

    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);;//Controller catches forgot password process from the forgot password modal and passes it to our authFactory
htsApp.controller('resetPasswordModalController', ['$scope', '$modalInstance', 'authFactory', 'token', function ($scope, $modalInstance, authFactory, token) {
    $scope.resetPassword = function (isValid) {
        if (isValid) {
            var newPassword = $scope.newPassword;


            authFactory.changePassword(newPassword, token).then(function (response) {

                console.log(response);

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss(response);

                }

            }, function () {

                $scope.message = "Please contact support.  Sorry for the trouble";

            });
        }

    };


    $scope.dismiss = function (response) {
        $modalInstance.dismiss(response);
    };

}]);;//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('signInModalController', ['$scope', '$modalInstance', '$window', 'authFactory', 'params', function ($scope, $modalInstance, $window, authFactory, params) {

    if (params.email) {
        $scope.email = params.email;
    }

    $scope.loginPassport = function (isValid) {
        if (isValid) {

            var email = $scope.email;
            var password = $scope.password;

            authFactory.login(email, password).then(function (response) {

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("successful login");

                }

            }, function () {

                $scope.message = "Ooops.. Login error, please contact support.";

            });
        }
    };

    //$scope.facebookAuth = function () {
    //    $window.open(ENV.facebookAuth);
    //};
    //
    //
    //$scope.twitterAuth = function () {
    //    $window.open(ENV.twitterAuth);
    //};


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


}]);;//Controller catches the create account process from the create account modal and passes it to our authFactory
htsApp.controller('signupModalContainer', ['$scope', '$modalInstance', 'authFactory', function ($scope, $modalInstance, authFactory) {
    $scope.signupPassport = function (isValid) {

        if (isValid) {
            var email = $scope.email;
            var password = $scope.password_verify;
            var name = $scope.name;

            //Private Beta
            var secret = $scope.secret;

            authFactory.signUp(email, password, name, secret).then(function (response) {

                console.log(response);

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    $scope.dismiss("success");

                }

            }, function () {

                alert("signup error");

            });

        }
    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };


}]);;//This factory handles all our ajax posts to the server for sign-in, account creation, password reset, and changing the actual password
htsApp.factory('authFactory', ['$http', 'Session', '$q', '$window', function ($http, Session, $q) {

    var factory = {};

    // =====================================
    // LOGIN ===============================
    // =====================================
    factory.login = function (email, password) {

        var deferred = $q.defer();

        $http.post("/login", { "email": email, "password": password })

            //success
            .then(function (passportResponse) {

                if (passportResponse.data.success) { //We are logged in!!

                    Session.create(passportResponse.data);

                    console.log('PASSPORT RESPONSE', passportResponse);

                    deferred.resolve(passportResponse.data);

                } else { //There was an error logging the user in

                    deferred.resolve(passportResponse.data);

                }

            },
            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    // =====================================
    // SIGN UP =============================
    // =====================================
    factory.signUp = function (email, password, name, secret) {

        var deferred = $q.defer();

        $http.post("/signup", { "email": email, "password": password, "name": name, "secret": secret})

            //success
            .then(function (passportResponse) {

                if (passportResponse.data) { //Successful registration

                    deferred.resolve(passportResponse.data);

                }

            },
            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    // =====================================
    // FORGOT PASSWORD =====================
    // =====================================
    factory.passwordReset = function (email) {
        var deferred = $q.defer();

        $http.post('/forgot', { "email": email})

            .then(function (passportResponse) {

                if (passportResponse.data) {

                    deferred.resolve(passportResponse.data);

                }
            },            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    // =====================================
    // RESETS PASSWORD =====================
    // =====================================
    factory.changePassword = function (password, token) {

        var deferred = $q.defer();

        $http.post('/reset', { "password": password, "token": token})

            .then(function (passportResponse) {

                if (passportResponse.data) {

                    deferred.resolve(passportResponse.data);

                }
            },            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };




    // =====================================
    // UPDATE PASSWORD WHILE LOGGED IN =====
    // =====================================
    factory.updatePassword = function (currentPassword, newPassword) {

        var deferred = $q.defer();

        $http.post('/reset', { "currentPassword": currentPassword, "newPassword": newPassword})

            .then(function (passportResponse) {

                if (passportResponse.data) {

                    deferred.resolve(passportResponse.data);

                }
            },            //error
            function (data, status, headers, config) {
                deferred.reject();

            });

        return deferred.promise;

    };


    return factory;
}]);;htsApp.controller('awesomeBarController', ['$window', '$scope', '$location', 'awesomeBarFactory', 'searchFactory', '$state', function ($window, $scope, $location, awesomeBarFactory, searchFactory, $state) {

    //$scope.awesomeText = "I'm searching for...";

    $scope.clearedPlaceholder = false;
    $scope.clearPlaceholder = function () {
        if (!$scope.clearedPlaceholder) {
            console.log("clearing placeholder");

            $scope.queryObj.q = "";
            $scope.clearedPlaceholder = true;
        }
    };






    $scope.queryObj = awesomeBarFactory.queryObj;

    //Redirects to results page with correct params
    $scope.awesomeBarSubmit = function () {

        if($scope.queryObj.q) {

            console.log('before sanatize', $scope.queryObj);

            searchFactory.resetResultsView();

            //cache the entire users search string before we strip it apart and build our query object
            var entireSearchString = $scope.queryObj.q;

            var strippedHTML = strip($scope.queryObj.q);

            console.log('stripped html', strippedHTML);

            var subString = strippedHTML.replace('@' + $scope.queryObj.city, "").trim();

            console.log('trimmed string', subString);

            $scope.queryObj.q = subString;

            console.log('after sanatize', $scope.queryObj);

            $state.go('results', $scope.queryObj);

            $scope.queryObj.q = entireSearchString;
        }

    };



    function strip(html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }



    $scope.validateQueryObj = function () {
        if($scope.queryObj.locationObj) {
            if($scope.queryObj.q.indexOf('@') === -1) {
                $scope.queryObj.city = null;
                $scope.queryObj.locationObj = null;
            }
        }
    };



    ////========= @ Places Ment.io trigger =========
    $scope.map = awesomeBarFactory.googleMap;

    $scope.searchPlaces = function (city) {
        if (city) {
            awesomeBarFactory.predictPlace(city).then(function (results) {
                $scope.cities = results;
            });
        }
    };

    $scope.getCityMetaData = function (selectedCity) {
        awesomeBarFactory.getCityMetaData(selectedCity).then(function (cityMetaData) {

            $scope.queryObj.city = selectedCity.description;

            $scope.queryObj.locationObj = cityMetaData;

        });
        return '<span class="mention-highlighter-location" contentEditable="false">@' + selectedCity.description + '</span>';
    };

}]);
;/**
 * Created by braddavis on 4/26/15.
 */
htsApp.factory('awesomeBarFactory', ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {

    var factory = {};


    factory.queryObj = {
        q: $stateParams.q || "I'm searching for...",
        city: null,
        locationObj: null
    };



    factory.googleMap = new google.maps.Map(document.createElement("map-canvas"));


    factory.predictPlace = function (city) {

        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(37.79738, -122.52464),
            new google.maps.LatLng(37.68879, -122.36122)
        );

        //need to set bounds to cornwall/bodmin
        var locationRequest = {
            input: city,
            bounds: defaultBounds,
            componentRestrictions: {country: 'US'}
        };

        var googlePlacesService = new google.maps.places.AutocompleteService();

        var deferred = $q.defer();

        //Get predictions from google
        googlePlacesService.getPlacePredictions(locationRequest, function (predictions, status) {
            deferred.resolve(predictions);
        });

        return deferred.promise;
    };



    factory.getCityMetaData = function (selectedPlace) {

        var googleMaps = new google.maps.places.PlacesService(factory.googleMap);

        //capture the place_id and send to google maps for metadata about the place
        var request = {
            placeId: selectedPlace.place_id
        };

        var deferred = $q.defer();

        googleMaps.getDetails(request, function (placeMetaData, status) {

            //TODO: Handle status and if google fail

            deferred.resolve(placeMetaData);
        });

        return deferred.promise;
    };

    return factory;

}]);;/**
 * Created by braddavis on 5/1/15.
 */
htsApp.controller('categorySelectorBar', ['$scope',  '$rootScope', 'Session', 'ivhTreeviewMgr', 'authModalFactory', 'categoryFactory', function ($scope, $rootScope, Session, ivhTreeviewMgr, authModalFactory, categoryFactory) {


    //Any time the user moves to a different page this function is called.
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'feed' || toState.name === 'feed.splash') {
            $scope.showCategorySelectorBar = true;
        } else {
            $scope.showCategorySelectorBar = false;
        }
    });

    //This obj binded to view to create category tree checklist
    $scope.feedCategoryObj = {};

    //Get the users categories they have chosen to watch in their feed.
    $scope.feedCategoryObj.userDefaultCategories = Session.userObj.user_settings.feed_categories;

    //Fetch all the possible categories from the server and pass them function that creates nested list the tree checklist UI can understand
    $scope.getAllCategoriesFromServer = function () {
        categoryFactory.lookupCategories().then(function (response) {

            if(response.status !== 200) {

                console.log(response.data.error);

            } else if (response.status === 200) {

                $scope.feedCategoryObj.nestedCategories = formatCategories(response.data.results);

                console.log($scope.feedCategoryObj.nestedCategories);

            }
        }, function (response) {

            console.log(response);

            //TODO: Use modal service to notify users
            console.log("category lookup error");

        });
    };
    $scope.getAllCategoriesFromServer();



    var formatCategories = function (serverCategories) {

        var safeSearchOn = Session.userObj.user_settings.safe_search;
        var sanitizedCategoryList = [];

        for (var i = 0; i < serverCategories.length; i++) {

            var parentCategory = serverCategories[i];

            switch (parentCategory.code) {
                case 'SSSS':
                case 'VVVV':
                case 'RRRR':
                case 'MMMM':
                case 'PPPP':
                    if(safeSearchOn && parentCategory.code === 'PPPP' ||  safeSearchOn && parentCategory.code === 'MMMM') { //If safe search is turned on
                        continue;
                    } else {
                        parentCategory.name = toTitleCase(parentCategory.name);
                        parentCategory.selected = isCategoryDefaultSelected(parentCategory.code);

                        for (var j = 0; j < parentCategory.categories.length; j++) {

                            var childCategory = parentCategory.categories[j];

                            childCategory.name = toTitleCase(childCategory.name);
                            childCategory.selected = isCategoryDefaultSelected(childCategory.code);

                            if (childCategory.selected) {
                                parentCategory.selected = true;
                            }
                        }

                        sanitizedCategoryList.push(parentCategory);
                    }
            }
        }

        ivhTreeviewMgr.validate(sanitizedCategoryList);

        console.log(sanitizedCategoryList);

        return sanitizedCategoryList;
    };


    //Capitalize first char of every word in sentence string
    function toTitleCase(str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }


    //This function used while converting 3Taps flat category list into nested list.
    //If this function returns true the checkbox will be pre-checked in the UI when the page is loaded cause user set this preference previously.
    var isCategoryDefaultSelected = function (categoryCode) {
        for(var k = 0; k < $scope.feedCategoryObj.userDefaultCategories.length; k++) {
            if($scope.feedCategoryObj.userDefaultCategories[k].code === categoryCode) {
                return true;
            } else if (k === $scope.feedCategoryObj.userDefaultCategories.length -1) {
                return false;
            }
        }
    };


    //This function called when user checks or unchecks any item on the category tree.
    $scope.categoryOnChange = function(node, isSelected, tree) {
        console.log(node, isSelected, tree);

        if(Session.userObj.user_settings.loggedIn) { //If the user is logged in

            var newSelectedCategories = [];

            for (t = 0; t < tree.length; t++) {
                if (!tree[t].selected) {
                    for (u = 0; u < tree[t].categories.length; u++) {
                        if (tree[t].categories[u].selected) {
                            newSelectedCategories.push(
                                {
                                    'name': tree[t].categories[u].name,
                                    'code': tree[t].categories[u].code
                                }
                            );
                        }
                    }
                } else {
                    newSelectedCategories.push(
                        {
                            'name': tree[t].name,
                            'code': tree[t].code
                        }
                    );
                }


            }

            console.log(newSelectedCategories);

            //Update the server
            Session.setSessionValue('feed_categories', newSelectedCategories, function (response) {
                if (response.status !== 200) {
                    alert('could not remove category from user feed.  please notify support.');
                }
            });

        } else {
            //TODO: Deselect the checked item cause user is not logged in.
            ivhTreeviewMgr.deselect($scope.feedCategoryObj.nestedCategories, node.name, false);
            authModalFactory.signInModal();
        }
    };

    //If the categoryFilter input experiences a change then expand that entire category tree as user types to filter
    $scope.expandTree = function () {
        ivhTreeviewMgr.expandRecursive($scope.feedCategoryObj.nestedCategories);
    };


    //Watches the category filter input.  If emptied then collapse the category tree
    $scope.$watch('filterCategories', function (newVal, oldVal) {
        if(newVal === '') {
            ivhTreeviewMgr.collapseRecursive($scope.feedCategoryObj.nestedCategories);
        }
    });


}]);;/**
 * Created by braddavis on 12/15/14.
 */
htsApp.controller('feed.controller', ['$scope', 'feedFactory', 'splashFactory', '$state', '$interval', function ($scope, feedFactory, splashFactory, $state, $interval) {

    $scope.status = feedFactory.status;

    $scope.testing = function (ev) {
        console.log(ev);
        //ev.stopPropagation();
    };


    //updateFeed is triggered on interval and performs polling call to server for more items
    var updateFeed = function () {

        $scope.currentDate = Math.floor(Date.now() / 1000);

        //If this is the first query from controller and we have data in feedFactory already then resume from persisted data.
        if (!$scope.results && feedFactory.persistedResults){
            console.log('recovering from persisted results', feedFactory.persistedResults);
            $scope.results = feedFactory.persistedResults;
            var resumePersisted = true;
        } else if (!$scope.results) {
            //While true the hashtagspinner will appear
            feedFactory.status.pleaseWait = true;
        }


        feedFactory.poll().then(function (response) {

            if (response.status !== 200) {

                $scope.status.pleaseWait = false;
                $scope.status.error.message = ":( Oops.. Something went wrong.";
                $scope.status.error.trace = response.data.error;

            } else if (response.status === 200) {

                if (!$scope.results || resumePersisted) { //If there are not results on the page yet, this is our first query

                    //TODO: Seems 3Taps items are not always sorted by newest to oldest.  May need Josh to sort these when we hit his posting API
                    //Calculate the number of results with images and add up scroll height. This is used for virtual scrolling
                    for (i = 0; i < response.data.external.postings.length; i++) {

                        var posting = response.data.external.postings[i];

                        if (posting.images.length === 0) {
                            posting.feedItemHeight = 179;
                        } else if (posting.images.length === 1) {
                            posting.feedItemHeight = 261;

                            if (posting.username === 'CRAIG') {
                                if(posting.images[0].full) {
                                    posting.images[0].full = posting.images[0].full.replace(/^http:\/\//i, '//');
                                }

                                if(posting.images[0].thumb) {
                                    posting.images[0].thumb = posting.images[0].thumb.replace(/^http:\/\//i, '//');
                                }

                                if(posting.images[0].images) {
                                    posting.images[0].images = posting.images[0].images.replace(/^http:\/\//i, '//');
                                }
                            }

                        } else {
                            posting.feedItemHeight = 420;

                            if (posting.username === 'CRAIG') {

                                for(var j=0; j < posting.images.length; j++){
                                    var imageObj = posting.images[j];

                                    if(imageObj.full) {
                                        imageObj.full = imageObj.full.replace(/^http:\/\//i, '//');
                                    }

                                    if(imageObj.thumb) {
                                        imageObj.thumb = imageObj.thumb.replace(/^http:\/\//i, '//');
                                    }

                                    if(imageObj.images) {
                                        imageObj.images = imageObj.images.replace(/^http:\/\//i, '//');
                                    }

                                }

                            }

                        }

                        if (resumePersisted) {
                            $scope.results.unshift(posting);
                        }
                    }

                    feedFactory.status.pleaseWait = false;

                    if (!resumePersisted) {
                        $scope.results = response.data.external.postings;
                    }


                    feedFactory.persistedResults = $scope.results.slice(0, 300);
                    resumePersisted = false;

                    //UI will query polling API every 30 seconds
                    var intervalUpdate = $interval(updateFeed, 60000, 0, true);

                    //This is called when user changes route. It stops javascript from interval polling in background.
                    $scope.$on('$destroy', function () {
                        $interval.cancel(intervalUpdate);
                    });

                } else { //If there are already results on the page the add them to the top of the array

                    //console.log('our new items', response.data.external.postings);

                    //Capture how far user has scroll down.
                    var scrollTopOffset = jQuery(".inner-container").scrollTop();

                    //Depending on number of images we add the a feedItemHeight property to each result.  This is used for virtual scrolling
                    for (i = 0; i < response.data.external.postings.length; i++) {

                        if(response.data.external.postings[i].images.length === 0) {
                            response.data.external.postings[i].feedItemHeight = 179;
                            scrollTopOffset = scrollTopOffset + 179;
                        } else if (response.data.external.postings[i].images.length === 1) {
                            response.data.external.postings[i].feedItemHeight = 216;
                            scrollTopOffset = scrollTopOffset + 216;
                        } else {
                            response.data.external.postings[i].feedItemHeight = 420;
                            scrollTopOffset = scrollTopOffset + 420;
                        }

                        //Push each new result to top of feed
                        $scope.results.unshift(response.data.external.postings[i]);
                    }

                    //Offset scroll bar location to page does not move after inserting new items.
                    jQuery(".inner-container").scrollTop(scrollTopOffset);

                    //Persist our most recent 300 items
                    feedFactory.persistedResults = $scope.results.slice(0, 300);

                    console.log('persisted results are: ', feedFactory.persistedResults);

                }


            }
        }, function (response) {

            console.log(response);

            //TODO: Use modal service to notify users
            //alert("polling error");

        });
    };
    updateFeed();



    //TODO: When user pulls down from top of screen perform poll and reset interval
    //openSplash called when suer clicks on item in feed for more details.
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        console.log(splashFactory.result);
        $state.go('feed.splash', { id: elems.result.postingId });
    };



    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        feedFactory.resetFeedView();
    });

}]);


//Filter used to calculate and format how long ago each item in the feed was posted.
htsApp.filter('secondsToTimeString', function() {
    return function(seconds) {
        var days = Math.floor(seconds / 86400);
        var hours = Math.floor((seconds % 86400) / 3600);
        var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
        var timeString = '';
        if(days > 0) timeString += (days > 1) ? (days + " days ") : (days + " day ");
        if(hours > 0) timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
        if(minutes >= 0) timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");
        return timeString;
    };
});;/**
 * Created by braddavis on 12/15/14.
 */
htsApp.factory('feedFactory', ['$http', '$stateParams', '$location', '$q', 'Session', function( $http, $stateParams, $location, $q, Session) {

    var factory = {};

    factory.status = {
        pleaseWait: true,
        error: {}
    };

    factory.queryParams = {};

    factory.poll = function () {

        var deferred = $q.defer();

        var polling_api = '';

        var category_groups = '';

        var categories = '';

        for(i=0; i < Session.userObj.user_settings.feed_categories.length; i++){
            if((Session.userObj.user_settings.feed_categories[i].code == 'AAAA') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'CCCC') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'DISP') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'SSSS') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'JJJJ') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'MMMM') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'PPPP') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'RRRR') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'SVCS') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'ZZZZ') ||
                (Session.userObj.user_settings.feed_categories[i].code == 'VVVV'))
            {
                category_groups += Session.userObj.user_settings.feed_categories[i].code + '|';
            } else {
                categories += Session.userObj.user_settings.feed_categories[i].code + '|';
            }
        }

        if(Session.userObj.user_settings.safe_search) {
            category_groups += '~PPPP|~MMMM';
        }


        polling_api = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/userfeed?category_group=" + category_groups + "&category=" + categories;


        if(factory.queryParams.anchor) {
            polling_api += "&anchor=" + factory.queryParams.anchor;
            polling_api += "&cityCode=" + factory.queryParams.cityCode;
        }

        $http({method: 'GET', url: polling_api}).
            then(function (response, status, headers, config) {

                console.log('polling response', response);

                if(!response.data.error) {

                    factory.queryParams.anchor = response.data.external.anchor;
                    factory.queryParams.cityCode = response.data.location.cityCode;

                    deferred.resolve(response);

                } else {

                    factory.status.pleaseWait = false;
                    factory.status.error.message = ":( Oops.. Something went wrong.";
                    factory.status.error.trace = response.data.error.response.error;


                    deferred.reject(response);
                }



            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };



    factory.resetFeedView = function () {

        factory.status.error = {};
    };



    return factory;
}]);;/**
 * Created by braddavis on 4/28/15.
 */
htsApp.controller('feedbackController', ['$scope', 'feedbackFactory', '$http', 'ENV', 'Notification', 'Session', function($scope, feedbackFactory, $http, ENV, Notification, Session) {

    $scope.feedback = feedbackFactory.feedback;

    $scope.userObj = Session.userObj;

    $scope.submitFeedback = function() {

        $scope.feedback.form.user = $scope.userObj.user_settings.name;

        $http.post(ENV.feedbackAPI, $scope.feedback).success(function(response) {

            if(response.success) {
                $scope.feedback.form.visible = false;
                $scope.feedback.form.generalFeedback = null;
                Notification.success({
                    title: "Feedback Sent!",
                    message: "You'll receive an email shortly.",
                    delay: 6000
                });
            } else if (response.error) {
                Notification.error({
                    title: "Could not submit your feedback",
                    message: response.error,
                    delay: 10000
                });
            }

        }).error(function(err) {
            Notification.error({
                title: "Could not submit your feedback",
                message: "Sorry! Something is big time wrong. Email us at feedback@hashtagsell.com.",
                delay: 10000
            });
        });
    };

}]);;/**
 * Created by braddavis on 4/28/15.
 */
htsApp.factory('feedbackFactory', function () {
   var factory = {};

    factory.feedback = {
        form: {
            user: null,
            generalFeedback: null,
            visible: false
        }
    };

    return factory;
});;htsApp.controller('filterBar', ['$scope', '$rootScope', 'searchFactory', '$timeout', 'sideNavFactory', function ($scope, $rootScope, searchFactory, $timeout, sideNavFactory) {

    //Any time the user moves to a different page this function is called.
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'results' || toState.name === 'results.splash') {
            $scope.showFilterBar = true;
        } else {
            $scope.showFilterBar = false;
        }
    });

    //Filtering
    $scope.filterToggles = searchFactory.filter;

    $scope.$watchGroup(['filterToggles.mustHaveImage', 'filterToggles.mustHavePrice'], function (newValues, oldValues, scope) {
        //searchFactory.imageFilter(value);

        console.log($scope.filterToggles);

        searchFactory.filterArray($scope.views, 'filter');

    });


    //View
    $scope.views = searchFactory.views;

    $scope.$watchGroup(['views.gridView', 'views.showMap'], function () {

        if($rootScope.currentState === "results") {

            $timeout(function () {
                searchFactory.filterArray($scope.views, 'resize');


                if ($scope.views.gridView) { //If grid view enabled don't show css gutters
                    sideNavFactory.sideNav.listView = false;
                } else if (!$scope.views.gridView && $scope.views.showMap) {  //If list view is enabled BUT map is visible don't show css gutters
                    sideNavFactory.sideNav.listView = false;
                } else if (!$scope.views.gridView && !$scope.views.showMap) {  //If list view is enabled AND map is NOT visible then show the css gutters
                    sideNavFactory.sideNav.listView = true;
                }


            }, 1);

        }
    });





    $scope.rangeSlider = searchFactory.priceSlider;
    console.log($scope.rangeSlider);

    $scope.slideDelegate = function (value) {
        console.log(value);
        searchFactory.priceSlider.userSetValue = true;
        console.log(searchFactory.priceSlider);

        searchFactory.filterArray($scope.views, 'filter');
        //searchFactory.priceSlider.rangeValue = value;
    };


    //Adds $ before the price slider values
    $scope.myFormatter = function(value) {
        return "$"+value;
    };



}]);;/**
 * Created by braddavis on 10/29/14.
 */
htsApp.controller('myFavesController', ['$scope', '$window', 'favesFactory', 'splashFactory', '$state', 'ngTableParams', '$filter', 'Session', 'quickComposeFactory', '$modal', '$log', function($scope, $window, favesFactory, splashFactory, $state, ngTableParams, $filter, Session, quickComposeFactory, $modal, $log) {

    $scope.currentFaves = Session.userObj.user_settings.favorites;

    if($scope.currentFaves.length === 0) {
        $scope.noItems = true;
    }

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


    //More info directives evaluate these values and display sent offers and questions about items
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.currentState = toState.name;
        $scope.expandedPostingId = toParams.postingId;
    });



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
            checked   +=  ($scope.checkboxes.items[favorite.postingId]) || 0;
            unchecked += (!$scope.checkboxes.items[favorite.postingId]) || 0;
        });

        console.log("checked: ", checked, "unchecked: ", unchecked);

        if ((unchecked === 0) && totalFaves !== 0 || (checked === 0) && totalFaves !== 0) {
            $scope.checkboxes.masterCheck = (checked == totalFaves);
        }
        if(checked === 0 || totalFaves === 0){
            $scope.checkboxes.checked = false;
        } else {
            $scope.checkboxes.checked = true;
        }
        angular.element(document.getElementById("select_all")).prop("indeterminate", (checked !== 0 && unchecked !== 0));
    }, true);

    // watch for master checkbox
    $scope.$watch('checkboxes.masterCheck', function(value) {
        angular.forEach($scope.currentFaves, function(favorite) {
            if (angular.isDefined(favorite.postingId)) {
                $scope.checkboxes.items[favorite.postingId] = value;
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


        var currentFavorites = $scope.currentFaves;

        var results = [];

        angular.forEach(checkedItems.items, function(selectedStatus, id) { //loop through all the favorites and find the ones that are checked
            if(selectedStatus) {  //Make sure the favorite is checked
                console.log('this item selected', selectedStatus, id);
                for(i=0; i<currentFavorites.length; i++){ //loop through each favorites metadata
                    if(currentFavorites[i].postingId == id){  //Match the id of checked favorite and get the rest of metadata from localstorage
                        results.push(currentFavorites[i]);
                    }
                }
            }
        });

        console.log(results);


        if(Session.userObj.user_settings.email_provider[0].value === "ask") {  //If user needs to pick their email provider

            var modalInstance = $modal.open({
                templateUrl: '/js/transactionButtons/modals/email/partials/transactionButtons.modal.email.partial.html',
                controller: 'quickComposeController',
                resolve: {
                    result: function () {
                        return results;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if (reason === "signUp") {
                    authModalFactory.signUpModal();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });

        } else {  //User already set their default email provider

            quickComposeFactory.generateMailTo(Session.userObj.user_settings.email_provider[0].value, results);

        }
    };

    $scope.UserLabels = favesFactory.getUserLabels(); //Gets all the users custom labels for the labels dropdown
    $scope.selected_labels = []; //Stores which labels are checked or not
    $scope.preselected = {name : []};  //Labels that should be pre-checked when user drops down labels menu

    $scope.removeIndividualLabel = function($event){
        event.stopPropagation();
        alert("Quick remove label feature soon.  Please check the item and remove the label for now.");
    };

    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(favorite){
        splashFactory.result = favorite;
        console.log(splashFactory.result);
        $state.go('watchlist.splash', { id: favorite.postingId });
    };

}]);;htsApp.factory('favesFactory', ['Session', 'myPostsFactory', function (Session, myPostsFactory) {

    //Init favesFactory Object
    var favesFactory = {};

    //Get the users current favorites
    favesFactory.currentFavorites = Session.userObj.user_settings.favorites;


    //Takes in a item and adds it to users favorites list or removes if already there
    favesFactory.addFave = function (item, callback) {

        var alreadyFavorited = _.some(Session.userObj.user_settings.favorites, function (favorite) {
                return (favorite.postingId === item.postingId);
            });


        if(!alreadyFavorited) { //check to make sure the item is not already favorited.

            if(item.external.source.code === "HSHTG") {

                myPostsFactory.getPostingIdQuestionsAndOffers(item.postingId).then(function (response) {

                    var postWithQuestionOfferAndProfile = response.data;

                    Session.userObj.user_settings.favorites.push(postWithQuestionOfferAndProfile);

                    Session.setSessionValue("favorites", Session.userObj.user_settings.favorites, callback);

                });

            } else {

                Session.userObj.user_settings.favorites.push(item);

                Session.setSessionValue("favorites", Session.userObj.user_settings.favorites, callback);

            }

        }

    };


    favesFactory.removeFave = function (item, callback) {
        var currentFavorites = Session.userObj.user_settings.favorites;

        //We use this array to store index of items that user may have ALREADY favorited
        var matchingIndexes = [];

        //If the new favorite's ID matching an existing favorite then note the index of that item
        _.some(currentFavorites, function(oldFav) {
            if(oldFav.postingId == item.postingId){
                matchingIndexes.push(currentFavorites.indexOf(oldFav));
            }
        });

        //If we have index of matching item then remove the favorite.  If we do not have index of existing favorite than add it.
        if(matchingIndexes.length > 0){
            currentFavorites.splice(matchingIndexes[0],1);

            Session.setSessionValue("favorites", currentFavorites, callback);
        }
    };





    //Socketio passes emit object and we update the wishlist items.
    favesFactory.updateFavorite = function (emit, callback) {
        var currentFavorites = Session.userObj.user_settings.favorites;

        console.log('emitted favorite object', emit);

        console.log('currentFavorites', currentFavorites);

        var matchingIndex;

        for(var i = 0; i < currentFavorites.length; i++){
            var oldFavorite = currentFavorites[i];

            console.log(oldFavorite.postingId, emit.posting.postingId);

            if(oldFavorite.postingId === emit.posting.postingId){
                matchingIndex = i;
                break;
            }
        }

        console.log('done with loop');

        if (matchingIndex >= 0) {
            console.log('here is matching favorite');
            console.log(currentFavorites[matchingIndex]);


            myPostsFactory.getPostingIdQuestionsAndOffers(emit.posting.postingId).then(function (response) {

                var postWithQuestionOfferAndProfile = response.data;

                Session.userObj.user_settings.favorites[matchingIndex] = postWithQuestionOfferAndProfile;


                try {
                    favesFactory.refreshTable();
                } catch(err){
                    console.log(err);
                } finally {
                    Session.setSessionValue("favorites", Session.userObj.user_settings.favorites, callback);
                }

            });


        }
    };




    favesFactory.checkFave = function (item, callback) {
        var currentFavorites = Session.userObj.user_settings.favorites;

        //We use this array to store index of items that user may have ALREADY favorited
        var matchingIndexes = [];

        //If the new favorite's ID matching an existing favorite then note the index of that item
        _.some(currentFavorites, function(oldFav) {
            if(oldFav.postingId == item.postingId){
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


    favesFactory.filterString = '';


    favesFactory.batchRemoveFaves = function(checkedItems){
        console.log(checkedItems);
        angular.forEach(checkedItems.items, function(checked, id) {
            console.log("checked: ", checked, "id: ", id);
            if(checked) {
                var tempObj = {};
                tempObj.postingId = id;
                favesFactory.removeFave(tempObj, function () {
                    favesFactory.refreshTable();
                });
            }
        });
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

}]);;/**
 * Created by braddavis on 2/22/15.
 */
htsApp.controller('watchlist.offers.controller', ['$scope', 'Session', 'offersFactory', 'Notification', function ($scope, Session, offersFactory, Notification) {

    $scope.userObj = Session.userObj;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };


    $scope.cancelOffer = function (offer) {

        var postingId = offer.postingId;
        var offerId = offer.offerId;

        offersFactory.deleteOffer(postingId, offerId).then(function (response) {

            console.log(response);

            if (response.status === 204) {



            } else {

                Notification.error({title: response.name, message: response.message, delay: 20000});

            }


        }, function (err) {

            console.log(err);

            Notification.error({title: err.data.name, message: err.data.message, delay: 20000});

        });

    };

}]);;/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("senderOffersMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/interested/offers/partials/watchlist.offers.html",
        controller: "watchlist.offers.controller"
    };
});;/**
 * Created by braddavis on 2/24/15.
 */
htsApp.controller('watchlist.questions.controller', ['$scope', 'qaFactory', '$state', 'Notification', 'myPostsFactory', 'Session', function ($scope, qaFactory, $state, Notification, myPostsFactory, Session) {

    console.log('watchlist.questions.controller');

    $scope.userObj = Session.userObj;

    //Toggles whether the posting owner sees questions they've already answered or not.
    $scope.showAnswered = false;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };


    $scope.deleteQuestion = function (postingId, questionId) {

        console.log(postingId, questionId);

        qaFactory.deleteQuestion(postingId, questionId).then(function (response) {

            if(response.status === 200){

                myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name);

                //$state.go('^');

            } else {

                Notification.error({title: response.name, message: response.message});

            }

        }, function (err) {

            //TODO: Alert status update

        });

    };

}]);;/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("senderQuestionsMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/interested/questions/partials/watchlist.questions.html",
        controller: "watchlist.questions.controller"
    };
});;/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('watchlistQuestionsFactory', ['$http', '$rootScope', 'ENV', '$q', 'utilsFactory', function ($http, $rootScope, ENV, $q, utilsFactory) {
    var factory = {};

    //Splash controller binds with this object to update view in realtime.
    factory.questions = {
        store: []
    };



    factory.getPostingIdQuestions = function (postingId) {

        var deferred = $q.defer();

        var params = {
            postingId: postingId,
            questions: true,
            count: 100
        };

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId + utilsFactory.bracketNotationURL(params)
        }).then(function (response, status, headers, config) {

            if(response.status === 200) {

                factory.questions.store = response.data.questions.results; //SplashFactory watches this store.

                deferred.resolve(response);

            } else {
                deferred.reject(response);
            }

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };


    factory.submitQuestion = function (question, post, username) {

        var deferred = $q.defer();

        var postingId = post.postingId;

        var data = {
            "username": username,
            "value" : question
        };

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + '/questions',
            data: data
        }).then(function (response, status, headers, config) {

            factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.deleteQuestion = function (postingId, questionId) {

        //mailboxFactory.mail.questions.sent.data = [];
        //mailboxFactory.mail.questions.received.data = [];

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + '/questions/' + questionId
        }).then(function (response, status, headers, config) {

            factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };


    factory.deleteAnswer = function (postingId, questionId, answerId) {

        //mailboxFactory.mail.questions.sent.data = [];
        //mailboxFactory.mail.questions.received.data = [];

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + '/questions/' + questionId + '/answers/ ' + answerId
        }).then(function (response, status, headers, config) {

            factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    return factory;
}]);;/**
 * Created by braddavis on 1/24/15.
 */
htsApp.controller('mainController', ['$scope', '$rootScope', 'sideNavFactory', '$timeout', 'Session', 'socketio', 'myPostsFactory', 'favesFactory', function ($scope, $rootScope, sideNavFactory, $timeout, Session, socketio, myPostsFactory, favesFactory) {

    $scope.userObj = Session.userObj;

    $scope.sideNav = sideNavFactory.sideNav;




    $scope.toggleOffCanvasSideNav = function () {
        $scope.sideNav.hidden = !$scope.sideNav.hidden;
    };




    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        $rootScope.previousState = fromState.name;
        $rootScope.currentState = toState.name;
        console.log('Previous state:' + $rootScope.previousState);
        console.log('Current state:' + $rootScope.currentState);

        if($rootScope.currentState !== 'feed.splash'  && $rootScope.currentState !== 'results.splash') {
            if ($rootScope.currentState === 'feed') {
                $scope.sideNav.listView = true;
            } else if($rootScope.previousState === 'results.splash' || $rootScope.previousState === 'feed.splash') {
                console.log('do nothing');
            } else {
                $scope.sideNav.listView = false;
            }
        }

        //Hide the side navigation after user clicks a link
        $scope.sideNav.hidden = true;


        if (toState.name === 'results') {

            $timeout(function () {

                //console.log('priming responsive navbar');

                var navbar = angular.element(document.getElementsByClassName('navbar-fixed-top'));
                var innercontainer = angular.element(document.getElementsByClassName('inner-container'));
                var sideBarContainer = angular.element(document.getElementsByClassName('sidebar-container'));

                var lastScrollTop = 0,
                    st,
                    scrollBarHidden = false;

                var scrollingUpTest = function () {

                    st = innercontainer.scrollTop();

                    if (st > lastScrollTop) {
                        lastScrollTop = st;
                        return false;
                    } else {
                        lastScrollTop = st;
                        return true;
                    }
                };

                innercontainer.on('scroll', function () {
                    var scrollingUp = scrollingUpTest();
                    var yScroll = innercontainer.scrollTop();

                    if (scrollBarHidden && scrollingUp) {
                        navbar.removeClass('hide-navbar');
                        sideBarContainer.removeClass('sidebar-container-roll-up');
                        scrollBarHidden = false;
                        //console.log('ACTION: Showing navbar!');

                    } else if (yScroll >= 50 && !scrollBarHidden && !scrollingUp) {
                        navbar.addClass('hide-navbar');
                        sideBarContainer.addClass('sidebar-container-roll-up');
                        scrollBarHidden = true;
                        //console.log('ACTION: Hiding navbar!');
                    }
                });

            }, 250);

        } else {

            var navbar = angular.element(document.getElementsByClassName('navbar-fixed-top'));
            var sideBarContainer = angular.element(document.getElementsByClassName('sidebar-container'));

            navbar.removeClass('hide-navbar');
            sideBarContainer.removeClass('sidebar-container-roll-up');
        }
    });



    //RUNS ON PAGE LOAD.  Fetches user object from server as soon as page loads
    if ($scope.userObj.user_settings.loggedIn) {

        Session.getUserFromServer().then(function (response) {
            Session.create(response);

        });
    }



    //Joins/Leaves rooms and builds/destroys userobject on login/logout
    $scope.$watch('userObj.user_settings.loggedIn', function(newValue, oldValue) {
        if(newValue){
            socketio.init(Session.userObj.user_settings.name);
            myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name).then(function(response){

                for(var i = 0; i < myPostsFactory.userPosts.data.length; i++){

                    var post = myPostsFactory.userPosts.data[i];

                    socketio.joinPostingRoom(post.postingId, 'postingOwner'); //Join the room of each posting the user owns.

                }

            });


            _.each(favesFactory.currentFavorites, function(favorite) {
                socketio.joinPostingRoom(favorite.postingId, 'inWatchList');
            });



        } else {
            if(socketio.cachedUsername) { //if the user was previously logged in they will have this value so we must cleanup.
                socketio.closeAllConnections();


                if(myPostsFactory.userPosts.data.length) {

                    for(var i = 0; i < myPostsFactory.userPosts.data.length; i++) {

                        var post = myPostsFactory.userPosts.data[i];

                        socketio.leavePostingRoom(post.postingId, 'postingOwner');
                    }
                }


                _.each(favesFactory.currentFavorites, function(favorite) {
                    socketio.leavePostingRoom(favorite.postingId, 'inWatchList');
                });

            }
        }
    }, true);

}]);;/**
 * Created by braddavis on 2/24/15.
 */
htsApp.factory('messagesFactory', function () {

    var factory = {};

    factory.newMessageNotification = function (message) {
        console.log(
            '%s said "%s" at %s in room %s',
            message.username,
            message.message,
            message.timestamp,
            message.recipient
        );
    };

    return factory;
});;/**
 * Created by braddavis on 4/22/15.
 */
htsApp.controller('metaController', ['$scope', 'metaFactory', function ($scope, metaFactory) {

    $scope.metatags = metaFactory.metatags;

}]);;/**
 * Created by braddavis on 4/22/15.
 */
htsApp.factory('metaFactory', ['ENV', function (ENV) {
    var factory = {};


    factory.metatags = {
        page: {
            title: "HashtagSell · Rethinking Online Classifieds",
            description: "HashtagSell.com is rethinking the way people buy and sell online.  Search millions of online classifieds in seconds!  Sell your next item with HashtagSell.com.",
            googleVerification: "QEL7PxohhyFKyG5zg8Utt8ohbB_HzYjdYUnDXdhFBt0",
            faviconUrl: "https://static.hashtagsell.com/htsApp/favicon/favicon.ico"
        },
        facebook: {
            title: "HashtagSell Online Classifieds",
            image: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.svg",
            site_name: "HashtagSell.com",
            description: "HashtagSell.com is rethinking the way people buy and sell online.  Search millions of online classifieds in seconds!  Sell your next item with HashtagSell.com.",
            url: ENV.htsAppUrl
        },
        twitter: {
            card: "summary",
            domain: "hashtagsell.com",
            site: "@hashtagsell",
            description: "HashtagSell.com is rethinking the way people buy and sell online.  Search millions of online classifieds in seconds!  Sell your next item with HashtagSell.com.",
            title: "HashtagSell.com - Rethinking Online Classifieds",
            url: ENV.htsAppUrl,
            creator: "",
            image: "https://static.hashtagsell.com/logos/hts/HashtagSell_Logo_Home.svg",
            appIdiPhone: "",
            appIdiPad: "",
            appIdGooglePlay: "",
            appUrliPhone: "",
            appUrliPad: "",
            appUrlGooglePlay: ""
        }
    };


    return factory;
}]);;/**
 * Created by braddavis on 2/21/15.
 */
htsApp.controller('myPosts.controller', ['$scope', '$filter', '$modal', '$window', 'myPostsFactory', 'Session', 'socketio', 'ngTableParams', 'newPostFactory', 'Notification', 'splashFactory', '$state', function ($scope, $filter, $modal, $window, myPostsFactory, Session, socketio, ngTableParams, newPostFactory, Notification, splashFactory, $state) {

    $scope.userPosts = myPostsFactory.userPosts;

    console.log($scope.userPosts);


    myPostsFactory.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 2000, // include all favorites on page one
        filter: {},         // initial filter
        sorting: {}         // initial sort
    }, {
        counts: [], //hides page sizes
        total: $scope.userPosts.data.length,
        getData: function($defer, params) {
            // use built-in angular filter
            var filteredData = $filter('filter')($scope.userPosts.data, myPostsFactory.filterString);
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.tableParams = myPostsFactory.tableParams;

    // Ugh... http://stackoverflow.com/questions/22892908/ng-table-typeerror-cannot-set-property-data-of-null
    $scope.tableParams.settings().$scope = $scope;

    //Declaring filters var so it can be attached to ng-table
    $scope.filters = {
        $: ''
    };


    //Filtering by all fields in table http://plnkr.co/edit/llb5k6?p=preview
    $scope.$watch("filters.$", function (value) {
        myPostsFactory.filterString = value;
        console.log(myPostsFactory.filterString);
        $scope.tableParams.reload();
    });


    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.currentState = toState.name;
        $scope.expandedPostingId = toParams.postingId;
    });




    $scope.newPost = function () {

        var modalInstance = $modal.open({
            templateUrl: '/js/newPost/modals/newPost/partials/newpost.html',
            controller: 'newPostModal',
            size: 'lg',
            resolve: {
                mentionsFactory: function () {
                    return newPostFactory;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.modalContent.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };






    $scope.countUnreadQuestions = function(post){

        var unreadQuestionsCount = 0;

        for(var i = 0; i < post.questions.results.length; i++){
            var question = post.questions.results[i];
            if(!question.answers.length){ //if question does not have answer
                unreadQuestionsCount++;
            }
        }

        return unreadQuestionsCount;
    };



    $scope.countUnreadOffers = function(post){

        var unreadOffersCount = 0;

        for(var i = 0; i < post.offers.results.length; i++){
            var offer = post.offers.results[i];

            unreadOffersCount++;

            for(var j = 0; j < offer.proposedTimes.length; j++){
                var proposedTime = offer.proposedTimes[j];

                if(proposedTime.acceptedAt){ //if question does not have answer
                    unreadOffersCount--;
                }

            }


        }

        return unreadOffersCount;
    };



    $scope.deletePost = function(post) {

        console.log(post);

        myPostsFactory.deletePost(post).then(function(response){

            if(response.status === 204) {

                socketio.leavePostingRoom(post.postingId, 'postingOwner');

                myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name).then(function(response){

                    if(response.status === 200) {

                    } else {

                        Notification.error({
                            title: 'Whoops',
                            message: 'Please notify support.  We coulnd\'t refresh your myPosts list after deleting an item.' ,
                            delay: 10000
                        });  //Send the webtoast

                        alert('could not refresh myPost list after deleting item.  contact support.');

                    }

                });

            } else {

                Notification.error({
                    title: 'Whoops',
                    message: 'Please notify support.  We coulnd\'t delete your item for some reason.' ,
                    delay: 10000
                });  //Send the webtoast

            }

        });
    };



    $scope.editPost = function(post) {

        Notification.error({
            title: 'Coming soon',
            message: 'Please delete and recreate the ad for now.  We\'re rolling out edit functionality soon! :)' ,
            delay: 10000
        });  //Send the webtoast

    };



    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(post){
        splashFactory.result = post;
        console.log(splashFactory.result);
        $state.go('myposts.splash', { id: post.postingId });
    };




    //FACEBOOK MGMT
    $scope.showFacebookPost = function (post) {
        $window.open("http://facebook.com");
    };

    $scope.removeFacebookPost = function (post) {

    };



    //TWITTER MGMT
    $scope.showTwitterPost = function (post) {
        $window.open("http://twitter.com");
    };

    $scope.removeTwitterPost = function (post) {

    };



    //EBAY MGMT
    $scope.showEbayPost = function (post) {
        $window.open(post.ebay.url);
    };

    $scope.removeEbayPost = function (post) {

    };

}]);;/**
 * Created by braddavis on 3/31/15.
 */
htsApp.factory('myPostsFactory', ['$http', 'ENV', '$q', 'utilsFactory', 'sideNavFactory', 'profileFactory', function ($http, ENV, $q, utilsFactory, sideNavFactory, profileFactory) {

    var factory = {};

    factory.userPosts = {
        data: [],
        updateMyPostsBadgeCount: function () {

            var unreadCount = 0;

            if(this.data.length){

                for(var i = 0; i < this.data.length; i++){

                    var post = this.data[i];

                    if(post.questions.results.length){

                        for (var j = 0; j < post.questions.results.length; j++){

                            var question = post.questions.results[j];

                            if(!question.answers.length){

                                unreadCount++;

                            }

                        }

                    }

                    if(post.offers.results.length){

                        for (var k = 0; k < post.offers.results.length; k++){

                            var offer = post.offers.results[k];

                            unreadCount++;

                            for(var l = 0; l < offer.proposedTimes.length; l++){
                                var proposedTime = offer.proposedTimes[l];

                                if(proposedTime.acceptedAt){ //if question does not have answer
                                    unreadCount--;
                                }

                            }

                        }

                    }

                }
            }

            sideNavFactory.items[1].alerts = unreadCount;
            return unreadCount;

        }
    };



    factory.getAllUserPosts = function (username) {

        var deferred = $q.defer();

        var params = {
            filters: {
                mandatory: {
                    exact: {
                        username: username
                    }
                }
            }
        };


        $http({
            method: 'GET',
            url: ENV.postingAPI + utilsFactory.bracketNotationURL(params)
        }).then(function (response) {

            var allUserPosts = response.data.results;

            if(allUserPosts.length) {

                if(factory.userPosts.data.length) { //If there are already items on screen then clear it before updating inventory.
                    factory.userPosts.data = [];
                }

                for (var i=0; i < allUserPosts.length; i++) {

                    var post = allUserPosts[i];

                    factory.getPostingIdQuestionsAndOffers(post.postingId).then(function (response) {

                        var postWithQuestionOfferAndProfile = response.data;

                        factory.userPosts.data.push(postWithQuestionOfferAndProfile);

                        factory.userPosts.updateMyPostsBadgeCount();

                        if(factory.userPosts.data.length === allUserPosts.length){ //if we're done caching all posts with questions and offers then resolve so we can update ui.
                            if(factory.tableParams) {
                                factory.tableParams.reload();
                            }

                            console.log(username + ' items for sale:', factory.userPosts);

                            deferred.resolve(response);
                        }

                    });

                }

            } else {

                factory.userPosts.data = [];

                sideNavFactory.items[1].alerts = 0;

            }

        }, function (err) {
            deferred.reject(err);
        });



        return deferred.promise;
    };







    factory.getPostingIdQuestionsAndOffers = function (postingId) {

        var deferred = $q.defer();

        var params = {
            postingId: postingId,
            questions: true,
            offers: true,
            count: 100
        };

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId + utilsFactory.bracketNotationURL(params)
        }).then(function (response, status, headers, config) {

            if(response.status === 200) {

                //console.log(response);

                //factory.questions.store = response.data.questions.results; //SplashFactory watches this store.
                if(response.data.questions.results.length) {

                    var questionDeferredCount = 0;

                    for(var i = 0; i < response.data.questions.results.length; i++) {

                        profileFactory.getUserProfile(response.data.questions.results[i].username).then(function (profileResponse) { //get user profiles of those who asked questions

                            questionDeferredCount++;

                            if(profileResponse.status === 200){

                                response.data.questions.results[questionDeferredCount-1].userProfile = profileResponse.data.user;

                            }

                            if(questionDeferredCount === response.data.questions.results.length){

                                if(!response.data.offers.results.length) {

                                    deferred.resolve(response);

                                }

                            }

                        });

                    }
                }

                if(response.data.offers.results.length) {

                    var offerDeferredCount = 0;

                    for (var j = 0; j < response.data.offers.results.length; j++) {

                        profileFactory.getUserProfile(response.data.offers.results[j].username).then(function (profileResponse) { //get user profiles of those who asked questions

                            offerDeferredCount++;

                            if (profileResponse.status === 200) {

                                response.data.offers.results[offerDeferredCount - 1].userProfile = profileResponse.data.user;

                            }

                            if (offerDeferredCount === response.data.offers.results.length) {

                                deferred.resolve(response);
                            }

                        });

                    }
                } else {

                    deferred.resolve(response);

                }


            } else {
                deferred.reject(response);
            }

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };




    factory.deletePost = function (post) {

        var deferred = $q.defer();


        $http({
            method: 'DELETE',
            url: ENV.postingAPI + post.postingId
        }).then(function (response, status, headers, config) {

            console.log('delete response: ', response);

            deferred.resolve(response);

        }, function (response, status, headers, config) {

            deferred.reject(response);
        });

        return deferred.promise;
    };


    return factory;

}]);;/**
 * Created by braddavis on 2/22/15.
 */
htsApp.controller('myPosts.offers.controller', ['$scope', 'offersFactory', 'myPostsFactory', 'socketio', '$state', 'Session', 'Notification', function ($scope, offersFactory, myPostsFactory, socketio, $state, Session, Notification) {

    $scope.userObj = Session.userObj;


    $scope.acceptOffer = function (offer) {

        var postingId = offer.postingId;
        var offerId = offer.offerId;
        var payload = offer.response;

        offersFactory.acceptOffer(postingId, offerId, payload).then(function (response) {

            if (response.status === 201) {

                var recipient = offer.username;

                if (!isBlank(offer.message)) {

                    socketio.sendMessage(recipient, offer.message);

                }

                myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name);

            } else {

                console.log(response);

                Notification.error({title: response.name, message: response.message, delay: 20000});

            }


        }, function (err) {

            console.log(err);

            Notification.error({title: err.data.name, message: err.data.message, delay: 20000});

        });

    };



    $scope.declineOffer = function (offer) {

        var postingId = offer.postingId;
        var offerId = offer.offerId;
        //var payload = $scope.offer.response;

        offersFactory.deleteOffer(postingId, offerId).then(function (response) {

            console.log(response);

            if (response.status === 204) {

                var recipient = offer.username;

                if(!isBlank(offer.message)) {

                    socketio.sendMessage(recipient, offer.message);
                } else {

                    socketio.sendMessage(recipient, offer.response);
                }

                myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name);

            } else {

                Notification.error({title: response.name, message: response.message, delay: 20000});

            }


        }, function (err) {

            Notification.error({title: "Contact Support", message: "Failed to decline the offer.  Error:" + err, delay: 20000});

        });

    };


    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

}]);;/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("ownerOffersMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/myPosts/offers/partials/myPosts.offers.html",
        controller: "myPosts.offers.controller"
    };
});;/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('offersFactory', ['$http', '$rootScope', '$q', 'ENV', 'Session', function ($http, $rootScope, $q, ENV, Session) {

    var factory = {};


    //Socket.io calls this function when new-offer is emitted
    factory.newOfferNotification = function (offer) {

        console.log(
            '%s placed an %s offers on postingId %s to meet @ %s around %s',
            offer.username,
            offer.proposedTimes.length,
            offer.postingId,
            offer.proposedTimes[0].where,
            offer.proposedTimes[0].when
        );

        console.log(offer);
    };





    factory.sendOffer = function (postingId, offer) {

        console.log('sending this offer', offer);

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + "/offers",
            data: offer
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    factory.acceptOffer = function (postingId, offerId, payload) {

        console.log('postingId', postingId);
        console.log('offerId', offerId);
        console.log('accepting this offer', payload);

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + "/offers/" + offerId + "/accept",
            data: payload
        }).then(function (response, status, headers, config) {


            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.deleteOffer = function (postingId, offerId) {

        console.log('Deleting offer', postingId, offerId);

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + "/offers/" + offerId
        }).then(function (response, status, headers, config) {

            //factory.getPostingIdOffers(postingId).then(function (response) {

                deferred.resolve(response);

            //}, function (err) {
            //
            //    deferred.reject(err);
            //
            //});

            //deferred.resolve(true);

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };



    //factory.getSingleOffer = function (postingId, offerId) {
    //
    //    var deferred = $q.defer();
    //
    //    $http({
    //        method: 'GET',
    //        url: ENV.postingAPI + postingId + "/offers/" + offerId
    //    }).then(function (response, status, headers, config) {
    //
    //        deferred.resolve(response);
    //
    //    }, function (err, status, headers, config) {
    //
    //        deferred.reject(err);
    //
    //    });
    //
    //    return deferred.promise;
    //
    //};



    //factory.getPostingIdOffers = function (postingId) {
    //
    //    var deferred = $q.defer();
    //
    //    $http({
    //        method: 'GET',
    //        url: ENV.postingAPI + postingId + '/offers'
    //    }).then(function (response, status, headers, config) {
    //
    //        factory.parseAllOffers(response.data.results).then(function (response) {
    //
    //            deferred.resolve(response);
    //
    //        }, function (err) {
    //
    //            deferred.reject(err);
    //
    //        });
    //
    //    }, function (err, status, headers, config) {
    //
    //        deferred.reject(err);
    //
    //    });
    //
    //    return deferred.promise;
    //
    //};



    //factory.getAllOffers = function (allUserItemsForSale) {
    //
    //    var deferred = $q.defer();
    //
    //    factory.allUserItemsForSale = allUserItemsForSale;
    //
    //    //mailboxFactory.mail.offers.received.data = [];
    //
    //    for(var i=0; i < allUserItemsForSale.length; i++) { //Loop though all the users items for sale and append offer to matching item
    //
    //        var item = allUserItemsForSale[i];
    //
    //        $http({
    //            method: 'GET',
    //            url: ENV.postingAPI + item.postingId + '/offers/'
    //        }).then(function (response, status, headers, config) {
    //
    //            factory.parseAllOffers(response.data.results).then(function (response) {
    //
    //                deferred.resolve(response);
    //
    //            }, function (err) {
    //
    //                deferred.reject(err);
    //
    //            });
    //
    //
    //
    //        }, function (err, status, headers, config) {
    //
    //            deferred.reject(err);
    //
    //        });
    //    }
    //
    //    return deferred.promise;
    //};


    //factory.parseAllOffers = function (allOffers) {
    //
    //    var deferred = $q.defer();
    //
    //    console.log('here is all our offers:', allOffers);
    //
    //    var offersSent = [];
    //
    //    var offersReceived = [];
    //
    //    for(var i=0; i < allOffers.length; i++ ){
    //        var offer = allOffers[i];
    //
    //        if(offer.username === Session.userObj.user_settings.name) {
    //            offersSent.push(offer);
    //        } else {
    //            offersReceived.push(offer);
    //        }
    //    }
    //
    //    //mailboxFactory.mail.offers.sent.data = mailboxFactory.mail.offers.sent.data.concat(offersSent);
    //    //mailboxFactory.mail.offers.received.data = mailboxFactory.mail.offers.received.data.concat(offersReceived);
    //    //mailboxFactory.mail.totalUnread();
    //
    //    //console.log('our mailbox: ',mailboxFactory.mail);
    //
    //    deferred.resolve();
    //
    //    return deferred.promise;
    //
    //};


    return factory;
}]);;/**
 * Created by braddavis on 2/24/15.
 */
htsApp.controller('myPosts.questions.controller', ['$scope', 'qaFactory', '$state', 'Notification', 'myPostsFactory', 'Session', function ($scope, qaFactory, $state, Notification, myPostsFactory, Session) {

    $scope.userObj = Session.userObj;

    //Toggles whether the posting owner sees questions they've already answered or not.
    $scope.showAnswered = false;

    //Drops down menu so posting owner can delete their item for sale.
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };



    $scope.submitAnswer = function (question, index) {

        var answerPayload = {
            username: question.username,
            value: question.givenAnswer
        };


        qaFactory.submitAnswer(question.postingId, question.questionId, answerPayload).then(function (response) {

            if(response.status === 201) {

                console.log(response);

                myPostsFactory.getAllUserPosts($scope.userObj.user_settings.name).then(function (response) {

                });

            } else {

                Notification.error({title: response.name, message: response.message});

            }

        }, function (err) {

            //TODO: Alert status update

        });

    };


    $scope.deleteQuestion = function (postingId, questionId, index) {

        qaFactory.deleteQuestion(postingId, questionId).then(function (response) {

            if(response.status === 204){

                $scope.post.questions.results.splice(index, 1);

                if(!$scope.post.questions.results.length) {
                    $state.go('^');
                }

            } else {

                Notification.error({title: response.name, message: response.message});

            }

        }, function (err) {

            //TODO: Alert status update

        });

    };

    $scope.updateAnswer = function (answerId) {
        $scope.deleteAnswer(answerId);
        $scope.submitAnswer();
    };

    $scope.deleteAnswer = function (answerId) {

        var postingId = $scope.question.postingId;
        var questionId = $scope.question.questionId;

        qaFactory.deleteAnswer(postingId, questionId, answerId).then(function (response) {

            //$state.go('^');

        }, function (err) {

            //TODO: Alert status update

        });
    };

}]);;/**
 * Created by braddavis on 4/1/15.
 */
htsApp.directive("ownerQuestionsMoreInfo", function() {
    return {
        restrict: "E",
        scope: { post: '=' },
        templateUrl: "js/myPosts/questions/partials/myPosts.questions.html",
        controller: "myPosts.questions.controller"
    };
});;/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('qaFactory', ['$http', '$rootScope', 'ENV', '$q', 'utilsFactory', function ($http, $rootScope, ENV, $q, utilsFactory) {
    var factory = {};

    //Splash controller binds with this object to update view in realtime.
    factory.questions = {
        store: []
    };



    factory.getPostingIdQuestions = function (postingId) {

        var deferred = $q.defer();

        var params = {
            postingId: postingId,
            questions: true,
            count: 100
        };

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId + utilsFactory.bracketNotationURL(params)
        }).then(function (response, status, headers, config) {

            if(response.status === 200) {

                factory.questions.store = response.data.questions.results; //SplashFactory watches this store.

                deferred.resolve(response);

            } else {
                deferred.reject(response);
            }

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };



    factory.submitQuestion = function (question, post, username) {

        var deferred = $q.defer();

        var postingId = post.postingId;

        var data = {
            "username": username,
            "value" : question
        };

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + '/questions',
            data: data
        }).then(function (response, status, headers, config) {

            if(response.status === 201) {

                factory.questions.store.unshift(response.data);

                deferred.resolve(response);

            } else {

                deferred.reject(response);

            }



        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.submitAnswer = function (postingId, questionId, payload) {

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ENV.postingAPI + postingId + '/questions/' + questionId + '/answers',
            data: payload
        }).then(function (response, status, headers, config) {

            //factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            //}, function (err) {
            //
            //    deferred.reject(err);
            //
            //});



        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;


    };

    factory.deleteQuestion = function (postingId, questionId) {

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + '/questions/' + questionId
        }).then(function (response, status, headers, config) {

            deferred.resolve(response);


        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;

    };


    factory.deleteAnswer = function (postingId, questionId, answerId) {

        var deferred = $q.defer();

        $http({
            method: 'DELETE',
            url: ENV.postingAPI + postingId + '/questions/' + questionId + '/answers/ ' + answerId
        }).then(function (response, status, headers, config) {

            factory.getPostingIdQuestions(postingId).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        }, function (err, status, headers, config) {

            deferred.reject(err);

        });

        return deferred.promise;
    };


    return factory;
}]);;htsApp.controller('newPostController', ['$scope', '$modal', 'newPostFactory', 'Session', 'authModalFactory', function ($scope, $modal, newPostFactory, Session, authModalFactory) {

    $scope.userObj = Session.userObj;

    $scope.newPost = function () {

        var modalInstance = $modal.open({
            templateUrl: '/js/newPost/modals/newPost/partials/newPost.html',
            controller: 'newPostModal',
            size: 'lg',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                mentionsFactory: function () {
                    return newPostFactory;
                }
            }
        });

        modalInstance.result.then(function (dismissObj) {

        }, function (dismissObj) {
            if(dismissObj.reason === "stageOneSuccess"){

                $scope.pushtoExternalService(dismissObj.post);
            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };



    $scope.pushtoExternalService = function (post) {

        var modalInstance = $modal.open({
            templateUrl: '/js/newPost/modals/pushToExternalSources/partials/newPost.pushToExternalSources.html',
            controller: 'pushNewPostToExternalSources',
            resolve: {
                newPost : function () {
                    return post;
                }
            }
        });

        modalInstance.result.then(function (dismissObj) {

        }, function (dismissObj) {
            if(dismissObj.reason === "stageTwoSuccess"){
                $scope.congrats(dismissObj);
            }
            console.log('Modal dismissed at: ' + new Date());
        });
    };




    $scope.congrats = function (postingObj) {

        var modalInstance = $modal.open({
            templateUrl: '/js/newPost/modals/congrats/partials/newPost.congrats.html',
            controller: 'newPostCongrats',
            resolve: {
                newPost: function () {
                    return postingObj;
                }
            }
        });

        modalInstance.result.then(function () {

        }, function (reason) {
            if(reason === "dismiss"){
                console.log('Modal dismissed at: ' + new Date());
            }
        });
    };



    $scope.signIn = function (size) {
        authModalFactory.signInModal();

    };


    $scope.signUp = function (size) {
        authModalFactory.signUpModal();
    };

}]);
;/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('newPostCongrats', ['$scope', '$modal', '$modalInstance', 'newPost', 'myPostsFactory', 'Session', 'socketio', function ($scope, $modal, $modalInstance, newPost, myPostsFactory, Session, socketio) {

    $scope.newPost = newPost;

    console.log(newPost);

    myPostsFactory.getAllUserPosts(Session.userObj.user_settings.name).then(function () {

        for(var i = 0; i < myPostsFactory.userPosts.data.length; i++){

            var post = myPostsFactory.userPosts.data[i];

            socketio.joinPostingRoom(post.postingId, 'postingOwner'); //Join the room of each posting the user owns.

        }
    });

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);;/**
 * Created by braddavis on 1/6/15.
 */
htsApp.controller('newPostModal', ['$scope', '$http', '$q', '$modalInstance', '$timeout', '$modal', 'mentionsFactory', '$templateCache', 'ENV', 'Session', 'authModalFactory', '$window', function ($scope, $http, $q, $modalInstance, $timeout, $modal, mentionsFactory, $templateCache, ENV, Session, authModalFactory, $window) {

    $scope.demoCleared = false;

    $scope.clearDemo = function () {
        console.log("clearing contents");
        if (!$scope.demoCleared) {
            document.getElementById("htsPost").innerHTML = "";
            $scope.demoCleared = true;
        }
    };

    $scope.jsonObj = mentionsFactory.jsonTemplate;

    $scope.formatted_jsonObj = function () {
        return JSON.stringify($scope.jsonObj, null, 4);
    };

    //TODO: Handle auctions
    //$scope.macros = {
    //    'obo': '*Or Best Offer*'
    //};

    $scope.dismiss = function (reason) {
        mentionsFactory.resetJsonTemplate();
        $modalInstance.dismiss(reason);
    };

    //Wait until modalinstance initialized then setup dropzone
    $modalInstance.opened.then(function () {

        console.log($scope);

        $scope.dropzoneConfig = {
            'options': { // passed into the Dropzone constructor
                paramName: "file", // The name that will be used to transfer the file
                maxFilesize: 15, // MB
                maxFiles: 10,
                thumbnailWidth: 48,
                thumbnailHeight: 48,
                previewTemplate: $templateCache.get('dropzone-thumbnail.html'),
                acceptedFiles: '.jpeg,.jpg,.png,.gif',
                url: "/upload",
                autoProcessQueue: false,
                uploadMultiple: true,
                parallelUploads: 10,
                clickable: "#imageUpload",
                previewsContainer: "#imgPreviewsContainer",
                dictDefaultMessage: ''
            },
            'eventHandlers': {
                'sendingmultiple': function (file, xhr, formData) {
                    console.log("sending for upload!");
                },
                'successmultiple': function (file, response) {

                    console.log('what is this!', response);

                    var newPost = $scope.jsonObj;

                    newPost.images = response.images;

                    $scope.publishPost();


                },
                'addedfile': function () {
                    console.log("image added");
                    if ($scope.numImages) {
                        $scope.numImages = $scope.numImages+1;
                        $scope.$apply($scope.numImages);
                    } else {
                        $scope.numImages = 1;
                        $scope.$apply($scope.numImages);
                    }
                },
                'removedfile': function () {
                    console.log("image removed");
                    $scope.numImages = $scope.numImages - 1;
                    scope.$apply($scope.numImages);
                },
                'uploadprogress': function(progress) {
                    //$scope.uploadProgress = progress;
                    //console.log($scope.uploadProgress);
                },
                'totaluploadprogress': function(progress) {
                    $scope.uploadProgress = progress;
                    $scope.$apply($scope.uploadProgress);
                    if(progress < 100) {
                        $scope.uploadMessage = progress+'%';
                        $scope.$apply($scope.uploadProgress);
                    } else if (progress === 100) {
                        $scope.uploadMessage = 'Preparing photos.. please wait.';
                        $scope.$apply($scope.uploadProgress);
                    }
                }
            },
            'init': {}
        };
    });


    $scope.processPost = function () {

        if(Session.userObj.user_settings.loggedIn) {

            if ($scope.numImages) {
                $scope.dropzoneConfig.init();
            } else {
                $scope.publishPost();
            }
        } else {

            authModalFactory.signInModal();

        }
    };


    //Sellbox directive calls this to update model when a hash
    $scope.cleanModel = function(type, mentionToRemove) {
        mentionsFactory.cleanModel(type, mentionToRemove);
    };


    $scope.publishPost = function () {
        var newPost = $scope.jsonObj;

        newPost.username = Session.userObj.user_settings.name;

        //loop through the hashtags and formulate the heading of post

        newPost.heading = '';
        for (var i = 0; i < newPost.mentions.hashtags.length; i++) {
            if (i !== newPost.mentions.hashtags.length - 1) {
                newPost.heading += newPost.mentions.hashtags[i] + " ";
            } else {
                newPost.heading += newPost.mentions.hashtags[i];
            }

            newPost.mentions.hashtags[i] = newPost.mentions.hashtags[i]; //Remove all the info we used to gather meta-data
        }

        //Josh's posting API
        $http.post(ENV.postingAPI, newPost).
            success(function(posting) {
                console.log("-----Post Complete----");
                console.log(posting);
                $modalInstance.dismiss({reason: "stageOneSuccess", post: posting});

            }).
            error(function(data, status, headers, config) {
                alert('post failed');
            });
    };

    //========= # Products =========
    $scope.searchProducts = function (term) {
        console.log(term);
        if (term) {
            mentionsFactory.predictProduct(term).then(function (results) {
                $scope.products = results;
                //console.log("Here is scope.products", $scope.products);
            });
        }
    };

    $scope.getProductTextRaw = function (product) {
        mentionsFactory.getProductMetaData(product).then(function (jsonTemplate) {
            //console.log(jsonTemplate);
            //console.log("done");
        });
        return '<span class="mention-highlighter" contentEditable="false">#' + product.value + '</span>';
    };


    //========= @ Places =========
    $scope.map = mentionsFactory.googleMap;

    $scope.searchPlaces = function (term) {
        console.log(term);
        if (term) {
            mentionsFactory.predictPlace(term).then(function (results) {
                $scope.places = results;
                console.log("Here is scope.places", $scope.places);
            });
        }
    };

    $scope.getPlacesTextRaw = function (selectedPlace) {
        mentionsFactory.getPlaceMetaData(selectedPlace).then(function (jsonTemplate) {
            console.log(jsonTemplate);
            console.log("done");
        });
        console.log("updated ui");
        return '<span class="mention-highlighter-location" contentEditable="false">@' + selectedPlace.description + '</span>';
    };

    //========= $ Prices =========
    $scope.searchPrice = function (term) {
        console.log(term);
        if (term) {
            $scope.prices = mentionsFactory.predictPrice(term);
            console.log("here is scope.prices", $scope.prices);
        }
    };

    $scope.getPricesTextRaw = function (selectedPrice) {
        mentionsFactory.getPriceMetaData(selectedPrice);
        return '<span class="mention-highlighter-price" contentEditable="false">$' + selectedPrice.suggestion + '</span>';
    };



    //Demo plays to describe how to sell an item
    (function demo () {
        $timeout(function () {
            if (!$scope.demoCleared) {
                $(".mention-highlighter").triggerHandler('show');
            }

            $timeout(function () {
                if (!$scope.demoCleared) {
                    $(".mention-highlighter").triggerHandler('hide');
                    $(".mention-highlighter-price").triggerHandler('show');
                }

                $timeout(function () {
                    if (!$scope.demoCleared) {
                        $(".mention-highlighter-price").triggerHandler('hide');
                        $(".mention-highlighter-location").triggerHandler('show');
                    }

                    $timeout(function () {
                        if (!$scope.demoCleared) {
                            $(".mention-highlighter-location").triggerHandler('hide');
                            $(".sellModalButton").triggerHandler('show');
                        }

                        $timeout(function () {
                            $(".sellModalButton").triggerHandler('hide');
                        }, 4000);

                    }, 4000);

                }, 4000);

            }, 4000);

        }, 1000);
    })();

}]);;/**
 * Created by braddavis on 1/6/15.
 */
htsApp.factory('newPostFactory', ['$q', '$http', '$filter', 'ENV', 'utilsFactory', 'Notification', function ($q, $http, $filter, ENV, utilsFactory, Notification) {

    var factory = {}; //init the factory

    factory.jsonTemplate = {
        "annotations": [],
        "category": null,
        "category_name": null,
        "category_group": null,
        "category_group_name": null,
        "heading": null,
        "body": null,
        "images": [],
        "location": {},
        "mentions": {
            "hashtags": [],
            "atTags": [],
            "priceTag": []
        },
        "price": null,
        "price_avg": null,
        "price_type": null,
        "source": "HSHTG",
        "username": null
    };


    factory.resetJsonTemplate = function () {
        factory.jsonTemplate = {
            "annotations": [],
            "category": null,
            "category_name": null,
            "category_group": null,
            "category_group_name": null,
            "heading": null,
            "body": null,
            "images": [],
            "location": {},
            "mentions": {
                "hashtags": [],
                "atTags": [],
                "priceTag": []
            },
            "price": null,
            "price_avg": null,
            "price_type": null,
            "source": "HSHTG",
            "username": null
        };
    };

    factory.predictProduct = function (term) {

        var products = [];
        var userTypedText = {value: term};

        var deferred = $q.defer();

        $http.jsonp('//suggestqueries.google.com/complete/search?callback=?', {
            params: {
                "client": "products-cc",
                "hl": "en",
                "jsonp": "JSON_CALLBACK",
                "gs_rn": 53,
                "gs_ri": "products-cc",
                "ds": "sh",
                "cp": 1,
                "gs_id": 9,
                "q": term,
                "xhr": "t"

            }
        }).success(function (data, status) {

            if (data[1].length > 0) {

                angular.forEach(data[1], function (val, key) {

                    var tmp = document.createElement("DIV");
                    tmp.innerHTML = val[0];
                    var strippedHtml = tmp.textContent || tmp.innerText || "";


                    products.push({"value": strippedHtml});
                });
                if (products[0].value !== userTypedText.value) {
                    products.splice(0, 0, userTypedText);
                }
                if (products.length > 7) {
                    products.length = 7; // prune suggestions list to only 6 items because we add the usersTyped word to top of list
                }
            } else {
                console.log("nothing found");
                products.push(userTypedText);
            }

            deferred.resolve(products);
        });

        return deferred.promise;
        // TODO: Wait for promise from http and update the highlighted mentioned text with appropriate metadata
        //        http://completion.amazon.com/search/complete?q=apar&search-alias=aps&mkt=1
        //        $http.jsonp('http://completion.amazon.com/search/complete', {
        //            params: {
        //                method: "completion",
        //                'search-alias': "aps",
        //                jsonp: "JSON_CALLBACK",
        //                q: term,
        //                mkt: 1
        //            }
        //        })
        //            .success(function (data,status) {
        //                console.log(data);
        //
        //                angular.forEach(data[1], function(val, key) {
        //
        //                    var tmp = document.createElement("DIV");
        //                    tmp.innerHTML = val[0];
        //                    var strippedHtml = tmp.textContent || tmp.innerText || "";
        //
        //                    products.push({"value":strippedHtml});
        //                });
        //
        //                products.length = 10; // prune suggestions list to only 5 items
        //
        //                $scope.products = products
        //                return products;
        //            });
    };


    factory.getProductMetaData = function (selectedProduct) {

        var deferred = $q.defer();

        if(selectedProduct) {
            this.jsonTemplate.mentions.hashtags.push(selectedProduct.value);
        }

        //TODO: Omit Adult Categories if Safe_Search is on
        //        if(!Session.getLoginStatus() || Session.getSessionValue("safe_search")){
        //            console.log("Safe Search is on!");
        //            POPULAR_CATEGORY_HASH_TABLESearchString+="~PPPP|~PMSM|~PMSW|~PWSM|~PWSW|~POTH|~MMMM|~MESC|~MFET|~MJOB|~MMSG|~MPNW|~MSTR|~MOTH";
        //        } else {
        //            POPULAR_CATEGORY_HASH_TABLESearchString = POPULAR_CATEGORY_HASH_TABLESearchString.substring(0, POPULAR_CATEGORY_HASH_TABLESearchString.length - 1);
        //        }

        if(this.jsonTemplate.mentions.hashtags.length) {

            //These are the only potential annotations we will ask the user for today.
            var annotationsDictionary = new Hashtable();
            annotationsDictionary.put("year", "Year");
            annotationsDictionary.put("condition", "Condition");
            annotationsDictionary.put("make", "Make");
            annotationsDictionary.put("title_status", "Title");
            annotationsDictionary.put("model", "Model");
            annotationsDictionary.put("mileage", "Mileage");
            annotationsDictionary.put("transmission", "Transmission");
            annotationsDictionary.put("drive", "Drive");
            annotationsDictionary.put("paint_color", "Paint");
            annotationsDictionary.put("type", "Type");
            annotationsDictionary.put("fuel", "Fuel");
            annotationsDictionary.put("size", "Size");
            annotationsDictionary.put("bathrooms", "Bath");
            annotationsDictionary.put("no_smoking", "Smoking");
            annotationsDictionary.put("bedrooms", "Rooms");
            annotationsDictionary.put("dogs", "Dogs");
            annotationsDictionary.put("cats", "Cats");
            annotationsDictionary.put("attached_garage", "Garage");
            annotationsDictionary.put("laundry_on_site", "Laundry");
            annotationsDictionary.put("sqft", "Sq Ft");
            annotationsDictionary.put("size_dimensions", "Dimensions");

            //ebay motors annotations
            annotationsDictionary.put("body_type", "Body Type");
            annotationsDictionary.put("drive_type", "Drive Type");
            annotationsDictionary.put("engine", "Engine");
            annotationsDictionary.put("exterior_color", "Exterior Color");
            annotationsDictionary.put("for_sale_by", "Seller Type");
            annotationsDictionary.put("interior_color", "Interior Color");
            annotationsDictionary.put("fuel_type", "Fuel Type");
            annotationsDictionary.put("listing_type", "Listing Type");
            annotationsDictionary.put("number_of_cylinders", "Cylinders");
            annotationsDictionary.put("options", "Options");
            annotationsDictionary.put("power_options", "Power Options");
            annotationsDictionary.put("safety_features", "Safety");
            annotationsDictionary.put("ship_to_location", "Ship To");
            annotationsDictionary.put("trim", "Trim");
            annotationsDictionary.put("vehicle_title", "Title");
            annotationsDictionary.put("vin", "Vin");
            annotationsDictionary.put("warranty", "Warranty");

            //autotrader annotations
            annotationsDictionary.put("bodyStyle", "Body Type");
            annotationsDictionary.put("drivetrain", "Drive Train");
            annotationsDictionary.put("exteriorColor", "Exterior Color");
            annotationsDictionary.put("interiorColor", "Interior Color");


            //amazon annotations
            annotationsDictionary.put("Color", "Color");
            annotationsDictionary.put("Brand", "Brand");
            annotationsDictionary.put("Material Type", "Material Type");
            annotationsDictionary.put("Model", "Model");
            //annotationsDictionary.put("Part Number", "Part Number");
            annotationsDictionary.put("Warranty", "Warranty");
            annotationsDictionary.put("CPU Speed", "Processor Speed");
            annotationsDictionary.put("CPU Type", "Processor Type");
            annotationsDictionary.put("Display Size", "Screen Size");
            annotationsDictionary.put("Operating System", "OS Version");
            //annotationsDictionary.put("Size", "Storage Capacity");
            annotationsDictionary.put("System Memory Size", "Memory");
            annotationsDictionary.put("Department", "Department");


            var queryString = this.jsonTemplate.mentions.hashtags.join(" ");


            $http.get(ENV.groupingsAPI + 'popular', {
                params: {
                    query: queryString
                }
            }).success(function (data, status) {

                var popularCategories = data;

                if (popularCategories.length) {
                    //now that we have the popular category code get all the conical information about that category
                    //TODO: Follow bug here so we can uses josh's posting api instead of brads janky one: https://github.com/HashtagSell/posting-api/issues/46

                    var mostPopularCategory = popularCategories[0].code;

                    $http.get(ENV.groupingsAPI + mostPopularCategory).success(function (data, status) {

                        factory.jsonTemplate.category = data.categories[0].code;
                        factory.jsonTemplate.category_name = $filter('capitalize')(data.categories[0].name);
                        factory.jsonTemplate.category_group = data.code;
                        factory.jsonTemplate.category_group_name = data.name;

                        var annotationsHashTable = new Hashtable();
                        var annotationCount = 0;

                        var priceCount = 0;
                        var totalPrice = 0;

                        //TODO: Follow bug here to remove the comma in future: https://github.com/HashtagSell/posting-api/issues/45
                        var defaultParams = {
                            start: 0,
                            count: 500,
                            filters: {
                                mandatory: {
                                    contains: {
                                        heading: queryString
                                    }
                                },
                                optional: {
                                    exact: {
                                        categoryCode: [factory.jsonTemplate.category]
                                    }
                                }
                            },
                            geo: {
                                coords: ['-122.431297', '37.773972'],
                                "min": 0,
                                "max": 100000
                            }
                        };

                        var bracketURL = utilsFactory.bracketNotationURL(defaultParams);


                        //FIRST GET ANNOTATIONS FROM OUR INTERNAL DATABASE.
                        $http({
                            method: 'GET',
                            url: ENV.postingAPI + bracketURL
                        }).success(function (data) {

                            console.log("ANNOTATION Query response: ", data);

                            if (data.results.length) {

                                for (var i = 0; i < data.results.length; i++) {

                                    var posting = data.results[i];

                                    if (posting.annotations) {

                                        var annotationObj = posting.annotations;

                                        //console.log(i, annotationObj);
                                        for (var key in annotationObj) {
                                            if (annotationsDictionary.containsKey(key)) {
                                                annotationCount++;
                                                if (annotationsHashTable.containsKey(key)) {
                                                    var currentCount = annotationsHashTable.get(key);
                                                    var plusOne = currentCount + 1;
                                                    annotationsHashTable.put(key, plusOne);
                                                } else {
                                                    annotationsHashTable.put(key, 1);
                                                }
                                            } else {
                                                //console.log("omitting cause", key, "is not in our dictionary");
                                            }
                                        }
                                    } else {
                                        //console.log("does not have annotation object", results[i]);
                                    }

                                    if (posting.askingPrice) {
                                        if (posting.askingPrice.value !== undefined) {
                                            //console.log(posting.askingPrice.value, ' + ', totalPrice, ' =');
                                            priceCount++;
                                            totalPrice = parseInt(totalPrice) + parseInt(posting.askingPrice.value);
                                            //console.log(totalPrice);
                                        }
                                    }
                                }


                                if (annotationsHashTable.size() > 0) {

                                    //Gather our popular annotations
                                    console.log("We have ", annotationsHashTable.size(), "unique annotations in : ", annotationCount, "results");
                                    var annotationArray = [];
                                    var avg_weight = Math.abs(annotationCount / annotationsHashTable.size());

                                    console.log("Annotations should weigh more than: ", avg_weight);

                                    annotationsHashTable.each(function (key) {

                                        var weight = Math.abs(annotationsHashTable.get(key));

                                        console.log(key, " has weight of", weight);

                                        if (weight >= avg_weight) {

                                            annotationArray.push({key: annotationsDictionary.get(key), value: null});

                                            console.log(weight, ">=", avg_weight);
                                        }
                                    });
                                }

                                //Caculate average price of all data we retreived.
                                if (totalPrice > 0) {
                                    factory.jsonTemplate.price_avg = totalPrice / priceCount;
                                }


                                $http.get(ENV.annotationsAPI, {
                                    params: {
                                        query: queryString
                                    }
                                }).success(function (data) {

                                    console.log('Amazon data', data);

                                    if (data.length) {

                                        for (var k = 0; k < data.length; k++) {

                                            var amazonAnnotation = data[k];

                                            var key = amazonAnnotation.name;

                                            if (annotationsDictionary.containsKey(key)) {

                                                annotationArray.push({
                                                    key: annotationsDictionary.get(key),
                                                    value: null
                                                });

                                            }
                                        }

                                        console.log("---------------------------");
                                        console.log("done adding Amazon annotations!");
                                        console.log("---------------------------");

                                        factory.jsonTemplate.annotations = annotationArray;

                                    }

                                    console.log(factory.jsonTemplate);

                                }).error(function (data) {

                                });


                            } else {
                                Notification.success({
                                    title: "Hrmmmmm",
                                    message: "Keep your hashtags simple."
                                });
                            }
                        });
                    });
                } else {
                    Notification.success({
                        title: "We need more info",
                        message: "We could not intelligently determine what category of item you're selling.  Please add more hashtags to your description."
                    });
                }

            }).error(function (data) {
                Notification.error({
                    title: 'Ooops.. Error',
                    message: data
                });
            });
        } else {
            this.jsonTemplate.annotations = [];
            this.jsonTemplate.category = null;
            this.jsonTemplate.category_name = null;
            this.jsonTemplate.category_group = null;
            this.jsonTemplate.category_group_name = null;
        }


        deferred.resolve(factory.jsonTemplate);

        return deferred.promise;

    };



    factory.cleanModel = function (type, valueToRemove) {

        if(type === "#") {

            console.log('HASHTAG TO REMOVE: ', valueToRemove);

            this.jsonTemplate.mentions.hashtags = _.without(this.jsonTemplate.mentions.hashtags, valueToRemove);

            console.log(this.jsonTemplate);

            factory.getProductMetaData();

        } else if (type === "$") {
            alert('remove cost');
        } else if (type === "@") {
            alert('remove location');
        }
    };





    //We use google maps as a service
    factory.googleMap = new google.maps.Map(document.createElement("map-canvas"));

    factory.predictPlace = function (term) {

        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(37.79738, -122.52464),
            new google.maps.LatLng(37.68879, -122.36122)
        );

        //need to set bounds to cornwall/bodmin
        var locationRequest = {
            input: term,
            bounds: defaultBounds,
            componentRestrictions: {country: 'US'}
        };

        var googlePlacesService = new google.maps.places.AutocompleteService();

        var deferred = $q.defer();

        //Get predictions from google
        googlePlacesService.getPlacePredictions(locationRequest, function (predictions, status) {

            deferred.resolve(predictions);
        });

        return deferred.promise;
    };


    factory.getPlaceMetaData = function (selectedPlace) {

        this.jsonTemplate.mentions.atTags.push(selectedPlace.description);

        var googleMaps = new google.maps.places.PlacesService(factory.googleMap);

        //capture the place_id and send to google maps for metadata about the place
        var request = {
            placeId: selectedPlace.place_id
        };

        var deferred = $q.defer();

        var city = null;
        var state = null;
        var country = null;
        var zipcode = null;

        googleMaps.getDetails(request, function (placeMetaData, status) {

            if (status != google.maps.places.PlacesServiceStatus.OK) {
                console.log(status);
                return;
            }

            placeMetaData.description = selectedPlace.description;

            console.log("here is our extra meta data");
            console.log(placeMetaData);

            var locationObj = {};
            var geo = {};
            geo.location = {};

            if (placeMetaData.formatted_address) {
                locationObj.formatted_address = placeMetaData.formatted_address;
            }


            if (placeMetaData.geometry.location.lat()) {
                locationObj.lat = placeMetaData.geometry.location.lat();
                locationObj.long = placeMetaData.geometry.location.lng();

                var lat = placeMetaData.geometry.location.lat();
                var long = placeMetaData.geometry.location.lng();

                geo.coords = [long, lat];
            }



            if (placeMetaData.address_components) {

                for (var i = 0; i < placeMetaData.address_components.length; ++i) {

                    //Get State
                    if (placeMetaData.address_components[i].types[0] == "administrative_area_level_1") {
                        state = placeMetaData.address_components[i].short_name;
                        locationObj.state = state;
                        geo.location.state = state;
                    }

                    //Get City
                    if (placeMetaData.address_components[i].types[0] == "locality") {
                        city = placeMetaData.address_components[i].long_name;
                        locationObj.short_name = city;
                        geo.location.city = city;
                    }

                    //Get Country
                    if (placeMetaData.address_components[i].types[0] == "country") {
                        country = placeMetaData.address_components[i].short_name;
                        locationObj.country = country;
                        geo.location.country = country;
                    }

                    //Get Zipcode
                    if (placeMetaData.address_components[i].types[0] == "postal_code") {
                        zipcode = placeMetaData.address_components[i].short_name;
                        locationObj.zipcode = zipcode;
                        geo.location.postalCode = zipcode;
                    }
                }

                //Postal code did not come back from intial geocode.. therefore we must reverse geocode to get postal code based on lat long.
                if(!geo.location.postalCode) {

                    $http.get('/search/reversegeocode', {
                        params: {
                            lat: placeMetaData.geometry.location.lat(),
                            long: placeMetaData.geometry.location.lng()
                        }
                    }).success(function (data, status) {

                        console.log(data);

                        for(j=0; j<data.results[0].address_components.length; j++){

                            var adComponent = data.results[0].address_components[j];

                            if (adComponent.types[0] == "postal_code") {
                                geo.location.postalCode = adComponent.long_name;
                                break;
                            }
                        }

                    });
                }

            }


            //TODO: GET THE CITY-CODE DATA FROM MONGODB COLLECTION
            if (city && state) {
                $http.get('../search/locations?', {
                    params: {
                        level: "city",
                        city: city + ", " + state
                    }
                }).success(function (data, status) {
                    if (data.success) {

                        if (data.metadata.bounds_max_lat) {
                            locationObj.bounds_max_lat = data.metadata.bounds_max_lat;
                        }

                        if (data.metadata.bounds_max_long) {
                            locationObj.bounds_max_long = data.metadata.bounds_max_long;
                        }

                        if (data.metadata.bounds_min_lat) {
                            locationObj.bounds_min_lat = data.metadata.bounds_min_lat;
                        }

                        if (data.metadata.bounds_min_long) {
                            locationObj.bounds_min_long = data.metadata.bounds_min_long;
                        }

                        if (data.metadata.code) {
                            locationObj.city = data.metadata.code;
                        }

                        if (data.metadata.full_name) {
                            locationObj.long_name = data.metadata.full_name;
                        }


                    } else {
                        console.log("Could not lookup metro code with api");
                    }
                });

                //evaluate accuracy
                if (locationObj.lat && locationObj.long) {
                    locationObj.accuracy = 0;
                } else if (locationObj.formatted_address) {
                    factory.jsonTemplate.location.accuracy = 1;
                }
                //TODO: Determine accuracy be evaluating lat lon boundaries

                factory.jsonTemplate.location = locationObj;

                factory.jsonTemplate.geo = geo;

                deferred.resolve(factory.jsonTemplate);
            }
        });

        return deferred.promise;
    };


    factory.predictPrice = function (term) {

        var priceSuggestionArray = [];
        priceSuggestionArray.push({suggestion: term, rate: "flat_rate", value: term});
        priceSuggestionArray.push({suggestion: term + "/hr", rate: "hourly", value: term});
        priceSuggestionArray.push({suggestion: term + "/day", rate: "daily", value: term});
        priceSuggestionArray.push({suggestion: term + "/week", rate: "weekly", value: term});
        priceSuggestionArray.push({suggestion: term + "/month", rate: "monthly", value: term});
        priceSuggestionArray.push({suggestion: term + "/year", rate: "yearly", value: term});

        return priceSuggestionArray;
    };

    factory.getPriceMetaData = function (selectedPrice) {

        this.jsonTemplate.price = selectedPrice.value;
        this.jsonTemplate.mentions.priceTag.push(selectedPrice.suggestion);
        this.jsonTemplate.price_type = selectedPrice.rate;
    };


    return factory;
}]);;/**
 * Created by braddavis on 2/25/15.
 */
htsApp.controller('pushNewPostToExternalSources', ['$scope', '$modal', '$modalInstance', '$q', 'externalSourcesSelection', 'newPost', 'Notification', 'facebookFactory', 'ebayFactory', 'twitterFactory', function ($scope, $modal, $modalInstance, $q, externalSourcesSelection, newPost, Notification, facebookFactory, ebayFactory, twitterFactory) {


    //Passes the newPost object with the selected external sources to the Josh's api.  Upon success passes resulting post obj to congrats.
    $scope.dismiss = function (reason) {

        if($scope.sourceSelections.length) {

            $scope.publishToFacebook().then(function(){
                $scope.publishToTwitter().then(function(){
                    $scope.publishToAmazon().then(function(){
                       $scope.publishToEbay().then(function(){
                           $scope.publishToCraigslist().then(function(){
                               $modalInstance.dismiss({reason: reason, post: newPost}); //Close the modal and display success!
                           });
                       });
                    });
                });
            });

        } else {

            $modalInstance.dismiss({reason: reason, post: newPost});

        }
    };


    $scope.publishToEbay = function () {

        var deferred = $q.defer();

        if(_.contains($scope.sourceSelections, 'eBay')) {

            ebayFactory.publishToEbay(newPost).then(function (response) {

                Notification.success({
                    message: "eBay publishing success!",
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();

            }, function (errResponse) {

                console.log('ebay err', errResponse);

                try {

                    Notification.error({
                        title: 'eBay ' + errResponse.name,
                        message: errResponse.sourceError.details[0].LongMessage[0],
                        delay: 10000
                    });  //Send the webtoast

                }
                catch (err) {

                    Notification.error({
                        title: 'eBay ' + errResponse.name,
                        message: errResponse.message || "Please contact support",
                        delay: 10000
                    });  //Send the webtoast
                }

                deferred.resolve();

            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };



    $scope.publishToFacebook = function () {

        var deferred = $q.defer();

        if(_.contains($scope.sourceSelections, 'Facebook')) {

            facebookFactory.publishToWall(newPost).then(function (response) {

                Notification.success({
                    message: "Facebook publishing success!",
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();

            }, function (errResponse) {

                Notification.error({
                    title: "Facebook publishing error",
                    message: errResponse.error.message,
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();
            });

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    $scope.publishToTwitter = function () {

        var deferred = $q.defer();

        if(_.contains($scope.sourceSelections, 'Twitter')) {

            twitterFactory.publishToTwitter(newPost).then(function (response) {

                Notification.success({
                    message: "Twitter publishing success!",
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();

            }, function (errResponse) {

                Notification.error({
                    title: "Twitter publishing error",
                    message: errResponse.error.message,
                    delay: 10000
                });  //Send the webtoast

                deferred.resolve();
            });

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    $scope.publishToAmazon = function () {

        var deferred = $q.defer();

        if(_.contains($scope.sourceSelections, 'Amazon')) {

            Notification.error({
                title: "Amazon publishing error",
                message: "push to amazon coming soon!",
                delay: 10000
            });  //Send the webtoast
            deferred.resolve();

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };


    $scope.publishToCraigslist = function () {

        var deferred = $q.defer();

        if(_.contains($scope.sourceSelections, 'Craigslist')) {

            Notification.error({
                title: "Craigslist publishing error",
                message: "push to craiglist coming soon!",
                delay: 10000
            });  //Send the webtoast
            deferred.resolve();

        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };



    $scope.sources = externalSourcesSelection.sources;

    $scope.sourceSelections = [];

    // watch fruits for changes
    $scope.$watch('sources.marketplaces|filter:{selected:true}', function (newValue) {

        $scope.sourceSelections = newValue.map(function (source) {
            return source.name;
        });

    }, true);


}]);;/**
 * Created by braddavis on 2/27/15.
 */
htsApp.factory('externalSourcesSelection', ['$http', function ($http) {
    var factory = {};

    //factory.sources = {
    //    marketplaces: [
    //        {"name": "eBay", "icon": "<i class='fa fa-facebook-square'></i>", selected: false},
    //        {"name": "Amazon", "icon": "<i class='fa fa-facebook-square'></i>", selected: false},
    //        {"name": "Craigslist", "icon": "<i class='fa fa-facebook-square'></i>", selected: false}
    //    ],
    //    socialNetworks: [
    //        {"name": "Facebook", "icon": "<i class='fa fa-facebook-square'></i>", selected: false},
    //        {"name": "Twitter", "icon": "<i class='fa fa-twitter-square'></i>", selected: false}
    //    ]
    //};


    factory.sources = {
        marketplaces: [
            {"name": "eBay", "class": "ebay", selected: false},
            {"name": "Amazon", "class": "amazon", selected: false},
            {"name": "Craigslist", "class": "craigslist", selected: false},
            {"name": "Facebook", "class": "facebook", selected: false},
            {"name": "Twitter", "class": "twitter", selected: false}
        ]
    };


    //TODO: return the successfully saved hts post JSON and join the socket.io room.



    return factory;
}]);;/**
 * Created by braddavis on 1/21/15.
 */
htsApp.controller('notifications.controller', ['$scope', function ($scope) {
    $scope.items = {
        collection: getRegularArray(1000)
    };


    function getRegularArray(size){
        var res = [];
        for(var i=0;i<size;i++){
            res.push({
                text: i,
                size: ~~(Math.random()*100 + 50)
            });
        }
        return res;
    }
}]);;/**
 * Created by braddavis on 4/5/15.
 */
htsApp.controller('profile.controller', ['$scope', 'profileFactory', function ($scope, profileFactory) {

    $scope.nav = profileFactory.nav;

}]);;/**
 * Created by braddavis on 4/2/15.
 */

htsApp.factory('profileFactory', ['$http', '$location', '$q', 'ENV', function ($http, $location, $q, ENV) {

    var factory = {};


    factory.messages = {
        private: {
            sent: [],
            received: []
        }
    };



    factory.nav = [
        {
            title: 'Messages',
            link: 'profile.messages',
            data: factory.messages
        },
        {
            title: 'Reviews',
            link: 'profile.reviews',
            data: []
        }
    ];








    factory.getUserProfile = function (username) {

        var deferred = $q.defer();

        var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/getprofile?username=" + username;

        $http({method: 'GET', url: url}).
            then(function (response, status, headers, config) {

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;

    };




    return factory;

}]);;htsApp.controller('results.controller', ['$scope', '$state', 'searchFactory', 'splashFactory', 'uiGmapGoogleMapApi', 'uiGmapIsReady', function ($scope, $state, searchFactory, splashFactory, uiGmapGoogleMapApi, uiGmapIsReady) {

    //While true the hashtagspinner will appear
    $scope.status = searchFactory.status;

    //Tracks state of grid visible or not
    $scope.views = searchFactory.views;


    //passes properties associated with clicked DOM element to splashFactory for detailed view
    $scope.openSplash = function(elems){
        splashFactory.result = elems.result;
        $state.go('results.splash', { id: elems.result.postingId });
    };


    //updateFeed is triggered on interval and performs polling call to server for more items
    var paginate = function (page) {

        searchFactory.paginate(page).then(function (response) {

            if (response.status !== 200) {

                searchFactory.status.pleaseWait = false;
                searchFactory.status.loading = false;
                searchFactory.status.error.message = ":( Oops.. Something went wrong.";
                searchFactory.status.error.trace = response.data.error;

            } else if (response.status === 200) {

                if(response.data.results.length) { //If we have results

                    if (!$scope.results) { //If there are not results on the page yet, this is our first query

                        searchFactory.filterArray($scope.views, 'pagination');

                        //Function passed into onVsIndexChange Directive
                        $scope.infiniteScroll = function (startIndex, endIndex) {
                            console.log('startIndex: ' + startIndex, 'endIndex: ' + endIndex, 'numRows: ' + $scope.results.gridRows.length);
                            if (!searchFactory.status.loading && endIndex >= $scope.results.gridRows.length - 3) {
                                console.log("paginating");
                                searchFactory.status.loadingMessage = "Fetching more awesome...";
                                searchFactory.status.loading = true;
                                page = page + 1;
                                paginate(page);
                            }
                        };

                    } else { //If there are already results on the page then add them to the bottom of the array and filter

                        searchFactory.filterArray($scope.views, 'pagination');

                    }

                    $scope.results = searchFactory.results;

                    searchFactory.status.pleaseWait = false;
                    searchFactory.status.loading = false;

                } else if (!response.data.results.length && page === 0) { //No results found on the first search

                    searchFactory.status.pleaseWait = false;
                    searchFactory.status.loading = false;
                    searchFactory.status.error.message = "¯\\_(ツ)_/¯  Nothing found.  Keep your searches simple.";

                } else if (!response.data.results.length && page > 0) { //No results found after pagination

                    searchFactory.status.pleaseWait = false;
                    searchFactory.status.loadingMessage = "Congratulations!  You've finished the internet!";

                }

            }
        }, function (response) {

            searchFactory.status.pleaseWait = false;
            searchFactory.status.loading = false;
            searchFactory.status.error.message = "(゜_゜) Oops.. Something went wrong.";
            searchFactory.status.error.trace = response.data.error;

        });
    };
    paginate(0);


    uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = searchFactory.map;
    });

}]);







htsApp.directive('onVsIndexChange', ['$parse', function ($parse) {
    return function ($scope, $element, $attrs) {
        var expr = $parse($attrs.onVsIndexChange);
        var fn = function () {
            expr($scope);
        };
        $scope.$watch('startIndex', fn);
        $scope.$watch('endIndex', fn);
    };
}]);








htsApp.directive('resizeGrid', ['$rootScope', '$window', 'searchFactory', function ($rootScope, $window, searchFactory) {
    return {
        restrict: 'A',
        link: function postLink($scope, element) {

            searchFactory.getInnerContainerDimensions = function () {
                return {
                    w: element.width(),
                    h: element.height()
                };
            };

            angular.element($window).bind('resize', function () {

                if($scope.views.gridView) {
                    searchFactory.filterArray($scope.views, 'resize');
                }

                $scope.$apply();
            });
        }
    };
}]);;/**
 * Created by braddavis on 12/14/14.
 */
htsApp.factory('searchFactory', ['$http', '$stateParams', '$location', '$q', '$log', '$timeout', 'utilsFactory', 'ENV', function ($http, $stateParams, $location, $q, $log, $timeout, utilsFactory, ENV) {

    var factory = {};

    factory.results = {
        gridRows: [],
        unfiltered: []
    };

    factory.filter = {
        mustHaveImage : false,
        mustHavePrice: false
    };

    factory.sort = {
        distance: true,
        price: false,
        datePosted: false
    };

    factory.priceSlider = {
        min: 0,
        max: 0,
        step: 1,
        rangeValue : [0,0],
        userSetValue: false
    };

    factory.views = {
        gridView: true,
        showMap: false
    };

    factory.status = {
        pleaseWait: true,
        error: {}
    };


    factory.getInnerContainerDimensions = function () {
        return 'function re-defined via resizeGrid directive';
    };


    factory.paginate = function (page) {

        var deferred = $q.defer();

        if (page === 0) {
            factory.getPopularCategories().then(function (response) {

                if(response.status === 200) {

                    if (response.data.length) {

                        var winningCategories = [];
                        var total = 0;

                        for (var i = 0; i < response.data.length; i++) {

                            var firstCategory = response.data[i];

                            total = total + firstCategory.count;

                        }

                        var avg = (total / response.data.length);

                        for (var j = 0; j < response.data.length; j++) {

                            var secondCategory = response.data[j];

                            if (secondCategory.count >= avg) {
                                winningCategories.push(secondCategory.code);
                            }

                        }

                        if (winningCategories.length) {
                            factory.defaultParams.filters.optional = {
                                exact: {
                                    categoryCode: winningCategories.join(",")
                                }
                            };
                        }
                    }
                }

            }).then(function () {

                console.log($stateParams);

                factory.defaultParams.filters.mandatory.contains.heading = $stateParams.q;

                if($stateParams.locationObj) {
                    if ($stateParams.locationObj.geometry) {

                        factory.defaultParams.geo.lookup = false;

                        var lat = $stateParams.locationObj.geometry.location.lat();
                        var lon = $stateParams.locationObj.geometry.location.lng();

                        factory.defaultParams.geo.coords = [lon, lat];
                    }
                }

                factory.query(page).then(function (response) {

                    deferred.resolve(response);

                });
            });
        } else {

            factory.query(page).then(function (response) {

                deferred.resolve(response);

            });
        }

        return deferred.promise;
    };



    factory.getPopularCategories = function () {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.groupingsAPI + 'popular',
            params: {'query' : $stateParams.q}
        }).then(function (response) {

            //console.log('weighted categories: ', response);

            deferred.resolve(response);

        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;

    };



    factory.query = function (page) {

        var deferred = $q.defer();

        //console.log(factory.defaultParams);

        var bracketURL = utilsFactory.bracketNotationURL(factory.defaultParams);
        console.log('final URL', bracketURL);

        $http({
            method: 'GET',
            url: ENV.postingAPI + bracketURL
        }).then(function (response) {

            //console.log('search results: ', response);

            if(response.data.results.length) {

                factory.defaultParams = {
                    start: (page + 1) * response.data.options.count,
                    count: response.data.options.count,
                    filters: response.data.options.filters,
                    geo: {
                        coords: response.data.options.geo.coords,
                        //min: response.data.results[response.data.results.length - 1].geo.distance,
                        min: response.data.options.geo.min,
                        max: response.data.options.geo.max
                    },
                    sort: {}
                };

                factory.results.unfiltered = factory.results.unfiltered.concat(response.data.results);
            }

            deferred.resolve(response);

        }, function (err) {
            deferred.reject(err);
        });



        return deferred.promise;

    };



    factory.defaultParams = {
        start: 0,
        count: 35,
        filters: {
            mandatory: {
                contains: {
                    heading: null
                }
            }
        },
        geo: {
            lookup: true,
            min: 0,
            max: 12890000 // 8000 miles in meters
        }
    };




    factory.map = {
        bounds: {},
        center: {
            latitude: 0,
            longitude: 0
        },
        zoom: 8,
        markers: [],
        options : {
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            panControl: false,
            mapTypeControl: false,
            maxZoom: 22,
            minZoom: 0,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        },
        clusterOptions: {
            gridSize: 35,
            maxZoom: 22,
            minZoom: 0,
            zoomOnClick: true,
            averageCenter: true,
            minimumClusterSize: 1,
            styles: [
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: 'https://static.hashtagsell.com/htsApp/map-elements/cluster1.png',
                    height: 35,
                    width: 35
                },
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: 'https://static.hashtagsell.com/htsApp/map-elements/cluster2.png',
                    height: 35,
                    width: 35
                },
                {
                    textColor: 'white',
                    fontFamily: 'Open Sans, Helvetica, Arial, sans-serif',
                    url: 'https://static.hashtagsell.com/htsApp/map-elements/cluster2.png',
                    height: 35,
                    width: 35
                }
            ]
        },
        refresh : false
    };

    factory.cachedColumnCalculation = null;



    //Evaluates the width of the browser and builds array with array of rows.
    factory.generateRows = function (results, reason, views) {

        var numColumns;

        //If user has gridView enabled calculate columns, else build list view.
        if (views.gridView) {
            var dimensions = factory.getInnerContainerDimensions();
            var itemWidth = 290;
            //console.log('width: ' + dimensions.w + '/' + itemWidth + ' equals...');
            numColumns = Math.floor(dimensions.w / itemWidth);
            factory.results.gridPercentageWidth = 100 / numColumns;
            //console.log("Calculated " + numColumns + " columns at " + factory.results.gridPercentageWidth + "% width.");
        } else {
            numColumns = 1;
            //console.log("List View: " + numColumns + " columns!");
        }



        if (numColumns !== factory.cachedColumnCalculation || reason === 'filter' || reason === 'pagination') {

            factory.cachedColumnCalculation = numColumns;

            //TODO: Don't clear all items just clear necessary ones??
            factory.results.gridRows = [];

            //Calculate the number of results with images and add up scroll height. This is used for virtual scrolling
            for (var i = 0; i < results.length; i++) {

                var rowHeight;

                //If gridview is turned on they height is always 350
                if (views.gridView) {
                    rowHeight = 390;
                } else { //else the user is in list view.  Height depends on whether result contains 2 or more images.
                    if(results[i].images.length === 0) {
                        rowHeight = 179;
                    } else if (results[i].images.length === 1) {
                        rowHeight = 261;
                    } else {
                        rowHeight = 420;
                    }
                }


                if (i % numColumns === 0) {
                    var row = {
                        rowHeight: rowHeight,
                        rowContents: []
                    };

                    for (var j = 0; j < numColumns; j++) {

                        if (i + j < results.length) {
                            //console.log(i + j);


                            if (results[i + j].askingPrice.value) {
                                factory.updatePriceSlider(results[i + j].askingPrice.value);
                            }


                            row.rowContents.push(results[i + j]);
                        }
                    }

                    factory.results.gridRows.push(row);

                    i = i + j - 1;
                    //console.log('Finshed row! New index is: ' + i);
                }
            }

            var maxPrice = factory.priceSlider.max;

            if (maxPrice < 100) {
                factory.priceSlider.step = 1;
            } else if (maxPrice > 100 && maxPrice < 500) {
                factory.priceSlider.step = 5;
            } else if (maxPrice > 500 && maxPrice < 2000) {
                factory.priceSlider.step = 10;
            } else if (maxPrice > 2000 && maxPrice < 10000) {
                factory.priceSlider.step = 50;
            } else if (maxPrice > 10000) {
                factory.priceSlider.step = 50;
            }


            console.log('Grid Rows: ', factory.results.gridRows);

        }

    };







    factory.updatePriceSlider = function (itemPrice) {

        if (parseInt(itemPrice) > parseInt(factory.priceSlider.max)) {

            factory.priceSlider.max = itemPrice;

            if (!factory.priceSlider.userSetValue) {
                factory.priceSlider.rangeValue[1] = itemPrice;
            }
        }
    };




    factory.markerMaker = function (result, index, visibleStatus) {

        var marker = {
            id: result.postingId,
            coords: {
                latitude: result.geo.coordinates[1],
                longitude: result.geo.coordinates[0]
            },
            title: result.heading,
            options: {
                visible: visibleStatus
            }
        };


        if(factory.views.showMap) {
            if (factory.map.markers[index]) {
                factory.map.markers[index].options.visible = visibleStatus;
            } else {
                factory.map.markers[index] = marker;
            }
        }
    };






    //simplest filters
    factory.mustHaveImage = function(element, index){

        var visibleStatus = Boolean(element.images.length);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    factory.mustHavePrice = function(element, index){

        var visibleStatus = Boolean(element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };

    //Does not filter out free items!!!
    factory.mustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(!element.askingPrice.value || element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };

    //Image filter possibilities
    factory.mustHaveImageAndPrice = function(element, index){

        var visibleStatus = Boolean(element.images.length && element.askingPrice.value);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    factory.mustHaveImageAndMustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(element.images.length && element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    //Price filter possibilites
    factory.mustHavePriceAndMustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(element.askingPrice.value && element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };


    //All filters combined
    factory.mustHavePriceAndMustHaveImageAndMustFitPriceRange = function(element, index){

        var visibleStatus = Boolean(element.images.length && element.askingPrice.value && element.askingPrice.value >= factory.priceSlider.rangeValue[0] && element.askingPrice.value <= factory.priceSlider.rangeValue[1]);

        factory.markerMaker(element, index, visibleStatus);

        return visibleStatus;
    };



    factory.filterArray = function (views, reason) {
        //console.log('filterArray view view type: ', views, factory.filter);
        //console.log('filterArray view reason: ', reason);

        var filterToggles = factory.filter;
        var priceSliderRange = factory.priceSlider;

        var filteredResults;

        //Must have price and must have image and must fit price range
        if (filterToggles.mustHavePrice && filterToggles.mustHaveImage && priceSliderRange.userSetValue) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHavePriceAndMustHaveImageAndMustFitPriceRange);

            factory.generateRows(filteredResults, reason, views);

            //Must have image and price RANGE
        } else if (filterToggles.mustHaveImage && priceSliderRange.userSetValue) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHaveImageAndMustFitPriceRange);

            factory.generateRows(filteredResults, reason, views);

            //Must have price and must fit price range
        } else if (filterToggles.mustHavePrice && priceSliderRange.userSetValue) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHavePriceAndMustFitPriceRange);

            factory.generateRows(filteredResults, reason, views);

            //Must Have Image and Must have Price
        } else if (filterToggles.mustHaveImage && filterToggles.mustHavePrice) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHaveImageAndPrice);

            factory.generateRows(filteredResults, reason, views);

            //Must have image
        } else if (filterToggles.mustHaveImage) {

            filteredResults = factory.results.unfiltered.filter(factory.mustHaveImage);

            factory.generateRows(filteredResults, reason, views);

            //Must have price
        } else if (filterToggles.mustHavePrice) {
            filteredResults = factory.results.unfiltered.filter(factory.mustHavePrice);

            factory.generateRows(filteredResults, reason, views);

            //Must fit in price RANGE
        } else if (priceSliderRange.userSetValue) {
            filteredResults = factory.results.unfiltered.filter(factory.mustFitPriceRange);

            factory.generateRows(filteredResults, reason, views);

            //All filters turned off, just generate rows
        } else {

            for (i = 0; i < factory.results.unfiltered.length; i++ ) {
                factory.markerMaker(factory.results.unfiltered[i], i, true);
            }

            factory.generateRows(factory.results.unfiltered, reason, views);
        }

        //TODO: This is a hack because clustered markers are not properly binded in angular-google-maps.  see here: https://github.com/angular-ui/angular-google-maps/issues/813

        if(factory.views.showMap) {
            refreshMap();
        }
    };


    var refreshMap = function () {
        factory.map.refresh = true;
        $timeout(function () {
            factory.map.refresh = false;
        }, 100);
    };



    factory.resetResultsView = function () {
        factory.results.gridRows = [];
        factory.results.unfiltered = [];

        factory.priceSlider.min = 0;
        factory.priceSlider.max = 0;
        factory.priceSlider.step = 1;
        factory.priceSlider.rangeValue = [0,0];
        factory.priceSlider.userSetValue = false;

        factory.filter.mustHaveImage = false;
        factory.filter.mustHavePrice = false;

        factory.views.gridView = true;
        factory.views.showMap = false;

        factory.map.markers = [];

        factory.status.pleaseWait = true;
        factory.status.error = {};

        factory.defaultParams = {
            start: 0,
            count: 35,
            filters: {
                mandatory: {
                    contains: {
                        heading: null
                    }
                }
            },
            geo: {
                lookup: true,
                min: 0,
                max: 100000
            }
        };
    };



    return factory;
}]);;//This service is getter and setter for user settings, favorites, logged in status etc.
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
}]);;/**
 * Created by braddavis on 11/29/14.
 */
htsApp.controller('settings.account.controller', ['$scope', '$timeout', '$window', 'Session', 'ebayFactory', 'facebookFactory', 'twitterFactory', 'Notification', function ($scope, $timeout, $window, Session, ebayFactory, facebookFactory, twitterFactory, Notification) {

    $scope.userObj = Session.userObj;

    $scope.options = {
        safeSearch: ['On', 'Off'],
        defaultEmail: [
            {name : "Always Ask", value: "ask"},
            {name : "Gmail", value : "gmail"},
            {name : "Yahoo", value : "yahoo"},
            {name : "Hotmail", value : "hotmail"},
            {name : "AOL", value : "aol"},
            {name : "Use Default Mail Client", value : "mailto"}
        ],
        location: ['Approximate', 'Exact']
    };

    $scope.defaultEmail = Session.userObj.user_settings.email_provider[0].value;

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

        if(selection === "On"){
            Session.setSessionValue('safe_search', true, function(){
                $scope.safeSearchUpdated = true;

                $timeout(function () {

                    $scope.safeSearchUpdated = false;
                }, 3000);
            });
        } else if (selection === "Off") {
            Session.setSessionValue('safe_search', false, function(){
                $scope.safeSearchUpdated = true;

                $timeout(function () {

                    $scope.safeSearchUpdated = false;
                }, 3000);
            });
        }

    };


    var buildDefaultEmail = function (selection) {
        //var value = Session.getSessionValue('email_provider');
        switch (selection) {
            case 'ask':
                return [{name : "Always Ask", value: "ask"}];
            case 'gmail':
                return [{name : "Gmail", value : "gmail"}];
            case 'yahoo':
                return [{name : "Yahoo", value : "yahoo"}];
            case 'hotmail':
                return [{name : "Hotmail", value : "hotmail"}];
            case 'aol':
                return [{name : "AOL", value : "aol"}];
            case 'mailto':
                return [{name : "Use Default Mail Client", value : "mailto"}];
        }
    };


    $scope.setDefaultEmail = function(selection){

        selection = buildDefaultEmail(selection);

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




    $scope.getEbaySessionID = function () {

        $scope.ebay = {};


        ebayFactory.getEbaySessionID().then(function (response) {
            //if (response.status === 200) {
            //    $scope.ebay.sessionId = response.data.GetSessionIDResponse.SessionID;
            //} else {
            //    console.log('ebay link not working');
            //}

            Session.setSessionValue('ebay', response.data.ebay, function () {
                Notification.success({
                    message: 'Successfully linked to eBay!',
                    delay: 10000
                });  //Send the webtoast
            });
        }, function(errResponse) {
            $scope.ebay.sessionId = errResponse.data.sessionId;
            $scope.ebay.err = errResponse.data.ebay.Errors.LongMessage;

            Notification.error({
                title: 'Manually link eBay account',
                message: 'After completing eBay authorization please click the big red button below.',
                delay: 10000
            });  //Send the webtoast
        });

    };


    $scope.getEbayToken = function () {
        ebayFactory.manuallyGetEbayToken($scope.ebay.sessionId).then(function (response) {
            console.log(response);
            if(!response.data.success) {
                $scope.ebay.sessionId = false;
                $scope.ebay.err = response.data.ebay.Errors.LongMessage;
            } else {
                Session.setSessionValue('ebay', response.data.ebay, function () {
                    console.log('ebay account connected!');
                });
            }
        });
    };




    $scope.disconnectFacebook = function () {
        facebookFactory.disconnectFacebook();
    };


    $scope.disconnectTwitter = function () {
        twitterFactory.disconnectTwitter();
    };


    $scope.disconnectEbay = function () {
        ebayFactory.disconnectEbay();
    };

    $scope.disconnectAmazon = function () {
        Session.setSessionValue('amazon', {}, function () {
            console.log('amazon account disconnected!');
        });
    };

}]);;/**
 * Created by braddavis on 4/16/15.
 */
htsApp.controller('settings.password.controller', ['$scope', 'authFactory', function ($scope, authFactory) {

    $scope.updatePassword = function (isValid) {
        if (isValid) {

            var currentPassword = $scope.currentPassword;
            var newPassword = $scope.newPassword;

            authFactory.updatePassword(currentPassword, newPassword).then(function (response) {

                if(response.error) {

                    $scope.message = response.error;

                } else if(response.success) {

                    //$scope.dismiss("success");

                    alert('done!');

                }


            }, function () {

                alert("update password error");

            });
        }
    };

}]);;/**
 * Created by braddavis on 11/29/14.
 */
htsApp.controller('settings.payment.controller', ['$scope', function ($scope) {
    //alert("payment controller");
}]);;/**
 * Created by braddavis on 11/29/14.
 */
htsApp.controller('settings.profile.controller', ['$scope', 'Session', '$templateCache', function ($scope, Session, $templateCache) {

    $scope.userObj = Session.userObj;

    $scope.bindingObj = {
        currentlyUploadingProfilePhoto: false,
        currentlyUploadingBannerPhoto: false,
        requireUpdate: true
    };


    $scope.profileDropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "profilePhoto", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            addRemoveLinks: false,
            thumbnailWidth: 90,
            thumbnailHeight: 90,
            previewsContainer: "#profilePreview",
            previewTemplate: $templateCache.get('profileUploadTemplate.tpl'),
            clickable: ".triggerProfileImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'addedfile': function () {
                $scope.$apply(function(){
                    $scope.bindingObj.currentlyUploadingProfilePhoto = true;
                });
            },
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('profile_photo', S3response.url, $scope.$apply(function () {
                    $scope.bindingObj.currentlyUploadingProfilePhoto = false;
                }));
            },
            'complete' : function () {
                console.log('complete');
            }
        }
    };




    $scope.bannerDropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "bannerPhoto", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            addRemoveLinks: false,
            thumbnailWidth: 180,
            thumbnailHeight: 120,
            previewsContainer: "#bannerPreview",
            previewTemplate: $templateCache.get('bannerUploadTemplate.tpl'),
            clickable: ".triggerBannerImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'addedfile': function () {
                $scope.$apply(function(){
                    $scope.bindingObj.currentlyUploadingBannerPhoto = true;
                });
            },
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('banner_photo', S3response.url, $scope.$apply(function () {
                    $scope.bindingObj.currentlyUploadingBannerPhoto = false;
                }));
            },
            'complete' : function () {
                console.log('complete');
            }
        }
    };



    $scope.requireUpdate = function () {
        $scope.bindingObj.requireUpdate = false;
    };

    $scope.submitUpdatedProfile = function () {
        Session.setSessionValue('biography', $scope.userObj.user_settings.biography, function () {
            $scope.bindingObj.requireUpdate = true;
        });
    };

}]);;htsApp.controller('sideNav.controller', ['$scope', '$rootScope', 'sideNavFactory', 'splashFactory', function ($scope, $rootScope, sideNavFactory, splashFactory) {

    $scope.sideNav = sideNavFactory;

    $scope.result = splashFactory.result;

    //Any time the user moves to a different page this function is called.
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        sideNavFactory.updateSideNav(toState);

        //Captures the previous state and appends it to the 'back' button in the settings and splash sideNav
        sideNavFactory.settingsMenu[0].link = fromState.name;
    });


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        sideNavFactory.redirect = toState;
    });

}]);;/**
 * Created by braddavis on 11/29/14.
 */
htsApp.factory('sideNavFactory', ['Session', function (Session) {

    var factory = {};

    //DEFAULT MENU
    factory.defaultMenu = [{
        name: "Feed",
        alerts: null,
        link: "feed",
        active: false
    }, {
        name: "My Posts",
        alerts: null,
        link: "myposts",
        active: false
    }, {
        name: "Watch List",
        alerts: null,
        link: "watchlist",
        active: false
    }, {
        name: "Notify Me",
        alerts: null,
        link: "notifications",
        active: false
    }];

    factory.items = factory.defaultMenu;




    //SETTINGS MENU
    factory.settingsMenu = [{
        name: "Back",
        alerts: null,
        link: null,
        active: false
    }, {
        name: "Account",
        alerts: null,
        link: "settings.account",
        active: false
    }, {
        name: "Password",
        alerts: null,
        link: "settings.password",
        active: false
    }, {
        name: "Profile",
        alerts: null,
        link: "settings.profile",
        active: false
    }, {
        name: "Payment & Shipping",
        alerts: null,
        link: "settings.payment",
        active: false
    }];


    //This function called by ui-router as moves through application.  Updates choice in side nav dynamically.
    factory.updateSideNav = function (toState) {

        switch (toState.name) {
            //Settings Menu
            case 'settings':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.account':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = true;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.password':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = true;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.profile':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = true;
                factory.settingsMenu[4].active = false;
                factory.items = factory.settingsMenu;
                break;
            case 'settings.payment':
                factory.settingsMenu[0].active = false;
                factory.settingsMenu[1].active = false;
                factory.settingsMenu[2].active = false;
                factory.settingsMenu[3].active = false;
                factory.settingsMenu[4].active = true;
                factory.items = factory.settingsMenu;
                break;



            //Default Menu
            case 'feed':
                factory.defaultMenu[0].active = true;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'myposts':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = true;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'watchlist':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = true;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'notifications':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = true;
                factory.items = factory.defaultMenu;
                break;
            case 'results':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
            case 'profile':
                factory.defaultMenu[0].active = false;
                factory.defaultMenu[1].active = false;
                factory.defaultMenu[2].active = false;
                factory.defaultMenu[3].active = false;
                factory.items = factory.defaultMenu;
                break;
        }
    };


    factory.sideNav = {
        hidden: true,
        listView: true
    };


    return factory;

}]);;htsApp.controller('sideProfile', ['$scope', 'Session', '$templateCache', function ($scope, Session, $templateCache) {

    $scope.userObj = Session.userObj;


    $scope.checkDefaultBanner = function(){
        return $scope.userObj.user_settings.banner_photo === '/images/userMenu/header-placeholder.png';
    };


    $scope.checkDefaultProfilePhoto = function(){
        return $scope.userObj.user_settings.profile_photo === '/images/userMenu/user-placeholder.png';
    };



    $scope.profileDropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "profilePhoto", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            previewTemplate : '<div style="display:none"></div>',
            clickable: ".sideNavTriggerProfileImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('profile_photo', S3response.url, function () {
                    console.log('done sidenav profile photo upload');
                });
            },
            'complete' : function () {
                console.log('complete');
            }
        }
    };




    $scope.bannerDropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            paramName: "bannerPhoto", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            acceptedFiles: '.jpeg,.jpg,.png,.gif',
            url: "/upload",
            autoProcessQueue: true,
            uploadMultiple: false,
            previewTemplate : '<div style="display:none"></div>',
            clickable: ".sideNavTriggerBannerImageUpload",
            dictDefaultMessage: ''
        },
        'eventHandlers': {
            'success': function (response) {

                var S3response = JSON.parse(response.xhr.response);

                console.log(S3response);

                Session.setSessionValue('banner_photo', S3response.url, $scope.$apply(function () {
                    console.log('done sidenav banner photo upload');
                }));
            },
            'complete' : function () {
                console.log('complete');
            }
        }
    };

}]);;/**
 * Created by braddavis on 1/25/15.
 */
htsApp.factory('socketio', ['ENV', '$http', 'myPostsFactory', 'Notification', 'favesFactory', function (ENV, $http, myPostsFactory, Notification, favesFactory) {

    var socketio = {
        postingSocket: io(ENV.realtimePostingAPI),
        userSocket: io(ENV.realtimeUserAPI),
        postings: [],
        usersViewing: []
    };



    socketio.joinPostingRoom = function (postingId, reason, callback) {

        //reason can be postingOwner, toggleSplash, inWatchList
        var permissionLevel = 0;
        if(reason === "toggleSplash") {
            permissionLevel = 1;
        } else if (reason === "inWatchList") {
            permissionLevel = 2;
        } else if (reason === "postingOwner") {
            permissionLevel = 3;
        }

        var handleRequest = false;

        if(socketio.postings.length) {
            for (var i = 0; i < socketio.postings.length; i++) {

                var previouslyJoinedRoom = socketio.postings[i];

                if (previouslyJoinedRoom.postingId === postingId) { //If the user is requesting to join a room they have already joined
                    if(previouslyJoinedRoom.permissionLevel < permissionLevel){ //If join request has a higher permission level than the room they have already joined
                        socketio.postings.splice(i, 1); //Remove the room with inferior permission from list of rooms user has access too.

                        handleRequest = true;

                        reason = socketio.cachedUsername + ' is joining posting room: ' + postingId + ' because requested permission level ' + permissionLevel + ' is greater than ' + previouslyJoinedRoom.permissionLevel;

                        break;
                    }
                } else { //this requested room to join is unique

                    if(i === socketio.postings.length - 1) { //if we have completed checking all rooms the user is currently subscribed too.

                        handleRequest = true;

                        reason = socketio.cachedUsername + ' is joining posting room: ' + postingId + ' for first time with permission level ' + permissionLevel;
                    }

                }
            }
        } else {//The user is not subscribed to any current posting rooms so add their first one.

            handleRequest = true;

            reason = socketio.cachedUsername + ' is joining posting room: ' + postingId + ' with permission level ' + permissionLevel + ' as their first room ';
        }


        if (handleRequest) {

            socketio.postings.push({'postingId': postingId, 'permissionLevel': permissionLevel});

            socketio.postingSocket.emit('join-room', {
                username: socketio.cachedUsername,
                roomId: postingId
            });

        } else {

            reason = socketio.cachedUsername + ' already joined posting room: ' + postingId + ' with higher permission level than ' + permissionLevel;

        }

        if(callback){
            callback();
        }

    };



    socketio.joinUserRoom = function (userRoomToJoin, visitor, callback) {
        socketio.usersViewing.push(visitor);

        console.log(visitor + ' is joining ' + userRoomToJoin + '\'s room: ');

        socketio.userSocket.emit('join-room', {
            username : visitor,
            roomId : userRoomToJoin
        });

        if(callback){
            callback();
        }
    };



    //Leave all rooms when user logs out.
    socketio.closeAllConnections = function (callback) { //called by main.controller.js

        socketio.leaveUserRoom(socketio.cachedUsername);

        socketio.cachedUsername = null;

        if(callback){
            callback();
        }
    };


    socketio.leavePostingRoom = function (postingId, reason, callback) {

        //reason can be postingOwner, splashToggle, inWatchList
        var permissionLevel = 0;
        if(reason === "toggleSplash") {
            permissionLevel = 1;
        } else if (reason === "inWatchList") {
            permissionLevel = 2;
        } else if (reason === "postingOwner") {
            permissionLevel = 3;
        }

        var handleRequest = false;

        if(socketio.postings.length) {
            for (var i = 0; i < socketio.postings.length; i++) {

                var previouslyJoinedRoom = socketio.postings[i];

                if (previouslyJoinedRoom.postingId === postingId) { //If the user is requesting to leave a room they have already joined
                    if(previouslyJoinedRoom.permissionLevel <= permissionLevel){ //If join request has a higher permission level than the room they have already joined

                        socketio.postings.splice(i, 1); //Remove the room with inferior permission from list of rooms user has access too.

                        handleRequest = true;

                        reason = socketio.cachedUsername + ' is leaving posting room: ' + postingId + ' because requested permission level ' + permissionLevel + ' is greater than or equal to ' + previouslyJoinedRoom.permissionLevel;

                        break;
                    } else {

                        reason = socketio.cachedUsername + ' is NOT leaving posting room: ' + postingId + ' because requested permission level ' + permissionLevel + ' is less than ' + previouslyJoinedRoom.permissionLevel;

                    }
                } else { //the requested room to leave is unique

                    if(i === socketio.postings.length - 1) { //if we have completed checking all rooms the user is currently subscribed too.

                        reason = socketio.cachedUsername + ' is requesting to leave posting room: ' + postingId + ' which they have not joined?';
                    }
                }
            }
        } else {//The user is not subscribed to any current posting rooms so add their first one.

            reason = socketio.cachedUsername + ' is requesting to leave posting room: ' + postingId + ' when they havent joined any rooms?';
        }


        if (handleRequest) {

            socketio.postingSocket.emit('leave-room', postingId);

        }

        if(callback){
            callback();
        }
    };


    socketio.leaveUserRoom = function (username, callback) {

        socketio.usersViewing.splice(socketio.usersViewing.indexOf(username), 1);

        console.log('leaving user room: ' + username);

        socketio.userSocket.emit('leave-room', username);

        if(callback){
            callback();
        }
    };




    socketio.sendMessage = function (recipient, messageText) {
        socketio.userSocket.emit('private-message', {
            message : messageText,
            recipient: recipient,
            username : socketio.cachedUsername
        });
    };



    // listen for messages
    socketio.userSocket.on('private-message', function(pm){

        console.log('emitted private message', pm);

        Notification.success({title: 'New message from @' + pm.username, message: pm.message, delay: 10000});  //Send the webtoast
    });


    // listen for offers
    socketio.postingSocket.on('make-offer', function (emit) {

        console.log('emitted make-offer', emit);

        //TODO: Need the offer object to include the sellers username
        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them the their offer is sent

            //favesFactory.addFave(emit.posting, function(){
            //
            //    var url = '"/watchlist/offers/' + emit.posting.postingId + '"';
            //
            //    Notification.success({
            //        title: '<a href=' + url + '>Meeting Request Sent!</a>',
            //        message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
            //        delay: 10000
            //    });  //Send the webtoast
            //
            //});




            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //The user sending the offer already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                        var url = '"/watchlist/offers/' + emit.posting.postingId + '"';

                        Notification.success({
                            title: '<a href=' + url + '>Meeting Request Sent!</a>',
                            message: '<a href=' + url + '>This watchlist item has been updated. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                } else { //The user sending the offer does not have this item in their watchlist.

                    favesFactory.addFave(emit.posting, function(){

                        var url = '"/watchlist/offers/' + emit.posting.postingId + '"';

                        Notification.success({
                            title: '<a href=' + url + '>Meeting Request Sent!</a>',
                            message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                }

            });



        } else if(emit.posting.username === socketio.cachedUsername) { //If the currently logged in user owns the item the offer was placed on

            //Update owners offers and notify them.
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated questions, offers, etc etc.  The owner app view updates realtime.

                var url = '"/myposts/offers/' + emit.posting.postingId + '"';

                Notification.success({
                    title: '<a href=' + url + '>New Offer</a>',
                    message: '<a href=' + url + '>@' + emit.username + ' would like to meet!</a>',
                    delay: 10000
                });  //Send the webtoast

            });

        } else { //update all the users who have the item in their wishlist

            favesFactory.updateFavorite(emit, function(){

                var url = '"//wishlist/offers/' + emit.posting.postingId + '"';

                Notification.success({
                    title: '<a href=' + url + '>Another user placed an offer on an item you\'re watching.</a>',
                    message: '<a href=' + url + '>'+  emit.posting.heading +' may go fast!  We\'re just letting you know!</a>',
                    delay: 10000
                });  //Send the webtoast

            });

        }

        console.log(
            '%s would like to meet %s regarding postingId: "%s"',
            emit.username,
            emit.proposedTimes,
            emit.posting.postingId
        );
    });


    // listen for questions
    socketio.postingSocket.on('question', function (emit) {

        console.log('emitted question', emit);

        if(emit.username === socketio.cachedUsername) { //If currently logged in user is the user who caused the emit then inform them their message will be sent


            favesFactory.checkFave(emit.posting, function (favorited) {

                if(favorited){ //This user asking the question already has the item in their watchlist

                    favesFactory.updateFavorite(emit, function(){

                        var url = '"/watchlist/questions/' + emit.posting.postingId + '"';

                        Notification.success({
                            title: '<a href=' + url + '>Question Sent!</a>',
                            message: '<a href=' + url + '>This watchlist item has been updated. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                } else { //The user asking the question does not have this item in their watchlist.

                    favesFactory.addFave(emit.posting, function(){

                        var url = '"/watchlist/questions/' + emit.posting.postingId + '"';

                        Notification.success({
                            title: '<a href=' + url + '>Question Sent!</a>',
                            message: '<a href=' + url + '>This item has been added to your watchlist. You\'ll be notified when the seller responds.</a>',
                            delay: 10000
                        });  //Send the webtoast

                    });

                }

            });


        } else if (emit.posting.username === socketio.cachedUsername) { //if currently logged in users owns the posting the emitted question relates to

            //Update owners questions and notify them
            myPostsFactory.getAllUserPosts(socketio.cachedUsername).then(function (response) { //Have the owner lookup all their items they're selling and the associated quesiotns, offers, etc etc.  The owner app view updates realtime.

                var url = '"/myposts/questions/' + emit.question.postingId + '"';

                Notification.success({
                    title: '<a href=' + url + '>New Question</a>',
                    message: '<a href=' + url + '>' + emit.question.value + '</a>',
                    delay: 10000
                });  //Send the webtoast

            });


        } else {  //This user is ALSO watching the same item but did not ask the question itself and does the own the item they are watching.. THEREFORE, silently update their watchlist.

            favesFactory.updateFavorite(emit, function(){
                console.log('silently updated watchlist');
            });
        }

        console.log(
            '%s asked a question on postingId %s : "%s"',
            emit.question.username,
            emit.posting.postingId,
            emit.question.value
        );
    });


    // listen for answers
    socketio.postingSocket.on('answer', function (emit) {

        console.log('emitted answer', emit);

        //TODO: Updates qaFactory.questions.store which causes splash to update.

        if(emit.posting.username !== socketio.cachedUsername){


            favesFactory.updateFavorite(emit, function(){

                //TODO: open posting in splash screen.
                var url =  '"/watchlist/questions/' + emit.posting.postingId + '"';
                Notification.success({title: '<a href=' + url + '>Question has been answered</a>', message: '<a href=' + url + '>' + emit.answer.value + '</a>', delay: 10000});  //Send the webtoast

            });

        }

        console.log(
            '%s answered a question on postingId %s : "%s"',
            emit.posting.username,
            emit.posting.postingId,
            emit.answer.value
        );

    });


    socketio.postingSocket.on('accept-offer', function (emit) {
        console.log('emitted offer acceptance', emit);

        if (emit.username === socketio.cachedUsername) { //if currently logged in same user who place the accepted offer

            //TODO: open posting in splash screen.
            var url =  '"/watchlist/offers/' + emit.posting.postingId + '"';

            Notification.success({title: '<a href=' + url + '>@' + emit.posting.username + ' accepted your meeting.</a>', message: '<a href=' + url + '>Please meet at ' + emit.acceptedTime.where + ' on ' + emit.acceptedTime.when + '.  A reminder email will be sent containing the online payment URL.  Sincerely, HashtagSell Team.</a>', delay: 10000});  //Send the webtoast

        }

        console.log(
            '%s accepted offer on postingId %s : "%s"',
            emit.posting.username,
            emit.posting.postingId,
            emit.acceptedTime.when
        );

    });


    // capture any hiccups in the connection and re-init as needed
    socketio.userSocket.on('reconnect', socketio.init);
    socketio.postingSocket.on('reconnect', socketio.init);



    socketio.init = function (username) { //called by main.controller.js
        if(username) {
            socketio.cachedUsername = username;

            var userRoomToJoin = username;
            var visitor = username;

            socketio.joinUserRoom(userRoomToJoin, visitor);
        }
    };


    return socketio;
}]);;/**
 * Created by braddavis on 11/15/14.
 */
htsApp.controller('splashController', ['$scope', '$rootScope', '$sce', '$state', '$modal', 'splashFactory', 'Session', 'socketio', function ($scope, $rootScope, $sce, $state, $modal, splashFactory, Session, socketio) {

    var splashInstanceCtrl = ['$scope', 'sideNavFactory', 'uiGmapGoogleMapApi', 'authModalFactory', 'favesFactory', 'qaFactory', 'transactionFactory', function ($scope, sideNavFactory, uiGmapGoogleMapApi, authModalFactory, favesFactory, qaFactory, transactionFactory) {

        $scope.userObj = Session.userObj;
        $scope.result = splashFactory.result;


        $scope.toggles = {
            showCarousel: true
        };

        uiGmapGoogleMapApi.then(function (maps) {
            $scope.map = {
                settings: {
                    center: {
                        latitude: $scope.result.geo.coordinates[1],
                        longitude: $scope.result.geo.coordinates[0]
                    },
                    options: {
                        zoomControl: false,
                        panControl: false,
                        mapTypeControl: false
                    },
                    zoom: 14
                },
                marker: {
                    id: 0,
                    coords: {
                        latitude: $scope.result.geo.coordinates[1],
                        longitude: $scope.result.geo.coordinates[0]
                    }
                }
            };
        });

        $scope.windowOptions = {
            content: 'please wait',
            disableAutoPan: false
        };

        //Google maps InfoWindow on marker click
        $scope.infoWindow = {
            show: false
        };

        $scope.onClick = function () {
            $scope.$apply(function () {
                $scope.infoWindow.show = !$scope.infoWindow.show;
            });
        };

        $scope.closeClick = function () {
            $scope.infoWindow.show = false;
        };


        if ($scope.userObj.user_settings.loggedIn) {
            favesFactory.checkFave($scope.result, function (response) {
                //console.log('favorited response: ' + response);
                $scope.favorited = response;
            });
        }


        $scope.toggleFave = function (item) {
            if ($scope.userObj.user_settings.loggedIn) {
                //console.log('favorited status: ', $scope.favorited);
                //console.log(item);
                if (!$scope.favorited) { //If not already favorited
                    favesFactory.addFave(item, function () {  //Add the favorite and flag as done
                        $scope.favorited = true;
                        socketio.joinPostingRoom(item.postingId, 'inWatchList'); //Join the room of each posting the user owns.
                    });
                } else { //toggle off favorite
                    favesFactory.removeFave(item, function () {
                        $scope.favorited = false;
                        socketio.leavePostingRoom(item.postingId, 'inWatchList'); //Join the room of each posting the user owns.
                    });
                }
            } else {

                authModalFactory.signInModal();

            }
        };


        //If we do not know the formatted address of the item we use the lat and lon to reverse geocode the closest address or cross-street.
        if (!$scope.result.external.threeTaps.location.formatted) {
            //console.log($scope.result);
            (function () {

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng($scope.result.geo.coordinates[0], $scope.result.geo.coordinates[1]);

                geocoder.geocode({'latLng': latlng}, function (results, status) {

                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            //console.log('reverse geocoded info', results[1].formatted_address);

                            $scope.windowOptions.content = results[1].formatted_address;
                        }
                    } else {
                        $scope.windowOptions.content = 'no address discovered';
                    }
                });

            })();
        } else {

            $scope.windowOptions.content = $scope.result.external.threeTaps.location.formatted;
            //console.log('already have address: ', $scope.windowOptions.content);
        }

        //If the item has annotations then display only ones that match our whitelist.
        if ($scope.result.annotations) {
            $scope.result.sanitized_annotations = splashFactory.sanitizeAnnotations($scope.result.annotations);
        }


        //Responsive Navigation
        $scope.sideNav = sideNavFactory.sideNav;

        //console.log($scope);

        $scope.toggleOffCanvasSideNav = function () {
            $scope.sideNav.hidden = !$scope.sideNav.hidden;
        };


        $scope.questions = qaFactory.questions;

        $scope.getPostingIdQuestions = function() {

            qaFactory.getPostingIdQuestions($scope.result.postingId).then(function (response) {
                //console.log(response);
            }, function (err) {
                console.log(err);
            });

        };

        $scope.submitQuestion = function(question) {

            var loggedIn = $scope.userObj.user_settings.loggedIn;

            if (loggedIn) {

                var post = $scope.result;
                var username = $scope.userObj.user_settings.name;

                socketio.joinPostingRoom(post.postingId, 'inWatchList', function(){

                    qaFactory.submitQuestion(question, post, username).then(function (response) {

                        console.log(response);

                    }, function (err) {
                        console.log(err);
                    });

                });

            } else {
                authModalFactory.signInModal();
            }
        };







        $scope.emailSeller = function (result) {
            transactionFactory.quickCompose(result);
        };

        $scope.displayPhone = function (result) {
            transactionFactory.displayPhone(result);
        };

        $scope.placeOffer = function (result) {
            transactionFactory.placeOffer(result);
        };

        $scope.buyOnline = function (result) {
            alert('online payment and shipping coming soon!');
        };

        $scope.placeBid = function (result) {
            transactionFactory.placeBid(result);
        };

        $scope.showOriginal = function (result) {
            transactionFactory.showOriginal(result);
        };


    }];




    var showSplashModal = function () {

        var splashInstance = $modal.open({
            backdrop: false,
            templateUrl: "/js/splash/partials/splash_content.html",
            windowTemplateUrl: "js/splash/partials/splash_window.html",
            controller: splashInstanceCtrl
        });


        splashInstance.result.then(function (selectedItem) {
            //console.log(selectedItem);
        }, function (direct) {
            if(!direct) {
                $state.go('^');
            }
        });


        //Hack this closes splash modal when user clicks back button https://github.com/angular-ui/bootstrap/issues/335
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            splashInstance.dismiss('direct');
        });
    };


    //If the result object is passed in via router
    if (splashFactory.result) {

        //console.log(splashFactory.result);

        showSplashModal();

    } else { //The user has been linked to the splash page or refreshed and we must lookup the item in our database.

        var postingId = $state.params.id;

        splashFactory.lookupItemDetails(postingId).then(function (response) {

            splashFactory.result = response.data;

            showSplashModal();

        }, function (err) {

            console.log(err);

        });

    }
}]);


htsApp.directive('splashSideProfile', ['splashFactory', function (splashFactory) {
    return {
        restrict: 'E',
        scope: {
            result: '='
        },
        link : function (scope, element, attrs) {

            //console.log(scope.result.images[0]);

            if(scope.result.external.source.code === 'HSHTG') {

                var username = scope.result.username;

                splashFactory.getUserProfile(username).then(function (response) {

                    if (response.status !== 200) {

                        var error = response.data.error;
                        console.log(error);

                    } else if (response.status === 200) {

                        var sellerProfileDetails = response.data.user;

                        //console.log(sellerProfileDetails);

                        var bannerElement = angular.element(element[0].querySelector('.profile'));
                        bannerElement.css({
                            'background-image': "url(" + sellerProfileDetails.banner_photo + ")",
                            'background-size': "cover"
                        });

                        var profilePhotoElement = angular.element(element[0].querySelector('.bs-profile-image'));
                        profilePhotoElement.css({
                            'background-image': "url(" + sellerProfileDetails.profile_photo + ")",
                            'background-size': "cover"
                        });

                        var username = angular.element(element[0].querySelector('.splash-bs-username'));
                        username.html('@' + sellerProfileDetails.name);
                    }
                }, function (response) {

                    console.log(response);

                    //TODO: Use modal service to notify users

                });
            } else {

                var bannerElement = angular.element(element[0].querySelector('.profile'));

                if (scope.result.images.length) {

                    var photoIndex = scope.result.images.length - 1;
                    var lastImage = scope.result.images[photoIndex].thumb || scope.result.images[photoIndex].images || scope.result.images[photoIndex].full;

                    bannerElement.css({
                        'background-image': "url(" + lastImage + ")",
                        'background-size': "cover"
                    });
                } else {

                    bannerElement.css({
                        'background-image': "url(https://static.hashtagsell.com/htsApp/placeholders/header-placeholder.png)",
                        'background-size': "cover"
                    });
                }

                var usernamePlaceholder = angular.element(element[0].querySelector('.splash-bs-username'));
                var sourceIcon = angular.element(element[0].querySelector('.bs-profile-image'));
                if (scope.result.external.source.code === "APSTD") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/apartments_com_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@apartments.com');

                } else if (scope.result.external.source.code === "AUTOD") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/autotrader_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@autotrader.com');

                } else if (scope.result.external.source.code === "BKPGE") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/backpage_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@backpage.com');

                } else if (scope.result.external.source.code === "CRAIG") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/craigslist_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@craigslist.com');

                } else if (scope.result.external.source.code === "EBAYM") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/ebay_motors_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@ebaymotors.com');

                } else if (scope.result.external.source.code === "E_BAY") {

                    sourceIcon.css({
                        'background-image': "url(https://static.hashtagsell.com/logos/marketplaces/ebay_splash.png)",
                        'background-size': "cover"
                    });

                    usernamePlaceholder.html('@ebay.com');
                }

            }
        }
    };
}]);;/**
 * Created by braddavis on 11/15/14.
 */
htsApp.factory('splashFactory', ['$http', '$location', '$q', 'ENV', function ($http, $location, $q, ENV) {

    var annotationsDictionary = new Hashtable();

    //CL annotations
    annotationsDictionary.put("source_neighborhood","Neighborhood");
    annotationsDictionary.put("year","Year");
    annotationsDictionary.put("condition","Condition");
    annotationsDictionary.put("make","Make");
    annotationsDictionary.put("title_status","Title");
    annotationsDictionary.put("model","Model");
    annotationsDictionary.put("mileage","Mileage");
    annotationsDictionary.put("transmission","Transmission");
    annotationsDictionary.put("drive","Drive");
    annotationsDictionary.put("paint_color","Paint");
    annotationsDictionary.put("type","Type");
    annotationsDictionary.put("fuel","Fuel");
    annotationsDictionary.put("size","Size");
    annotationsDictionary.put("bathrooms","Bath");
    annotationsDictionary.put("available","Available");
    annotationsDictionary.put("no_smoking","Smoking");
    annotationsDictionary.put("bedrooms","Rooms");
    annotationsDictionary.put("dogs","Dogs");
    annotationsDictionary.put("cats","Cats");
    annotationsDictionary.put("attached_garage","Garage");
    annotationsDictionary.put("laundry_on_site","Laundry");
    annotationsDictionary.put("sqft","Sq Ft");
    annotationsDictionary.put("size_dimensions","Dimensions");


    //TODO: Remove after svnt
    //annotationsDictionary.put("Hard Drive (Gb)","Hard Drive");
    //annotationsDictionary.put("Memory (Gb)","Memory");
    //annotationsDictionary.put("Screen (inches)","Screen");
    //annotationsDictionary.put("Warranty","Warranty");


    //ebay annotations
    //annotationsDictionary.put("listingtype","Listing Type");

    //ebay motors annotations
    annotationsDictionary.put("body_type","Body Type");
    annotationsDictionary.put("drive_type","Drive Type");
    annotationsDictionary.put("engine","Engine");
    annotationsDictionary.put("exterior_color","Exterior Color");
    annotationsDictionary.put("for_sale_by","Seller Type");
    annotationsDictionary.put("interior_color","Interior Color");
    annotationsDictionary.put("fuel_type","Fuel Type");
    annotationsDictionary.put("listing_type","Listing Type");
    annotationsDictionary.put("number_of_cylinders","Cylinders");
    annotationsDictionary.put("options","Options");
    annotationsDictionary.put("power_options","Power Options");
    annotationsDictionary.put("safety_features","Safety");
    annotationsDictionary.put("ship_to_location","Ship To");
    annotationsDictionary.put("trim","Trim");
    annotationsDictionary.put("vehicle_title","Title");
    annotationsDictionary.put("vin","Vin");
    annotationsDictionary.put("warranty","Warranty");

    //autotrader annotations
    annotationsDictionary.put("bodyStyle","Body Type");
    annotationsDictionary.put("drivetrain","Drive Train");
    annotationsDictionary.put("exteriorColor","Exterior Color");
    annotationsDictionary.put("interiorColor","Interior Color");
    annotationsDictionary.put("seller","Seller Type");

    var factory = {};

    factory.sanitizeAnnotations = function (annoationsObj) {

        var sanitizedAnnotationsObj = {};
        //console.log(annoationsObj);
        angular.forEach(annoationsObj, function(value, key) {

            if(typeof key === 'string') {
                var validatedKey = annotationsDictionary.get(key);

                if (validatedKey) {
                    sanitizedAnnotationsObj[validatedKey] = value;
                }
            } else {  //TODO: Fix me, HSHTG items format annotation differently
                //console.log(value);

                //var hshtgAnnotation = value;
                //
                //var hshtgvalidatedKey = annotationsDictionary.get(hshtgAnnotation.key);

                //if (hshtgvalidatedKey) {
                //    if(hshtgvalidatedKey === "Hard Drive" || hshtgvalidatedKey === "Memory") {
                //
                //        sanitizedAnnotationsObj[hshtgvalidatedKey] = hshtgAnnotation.value+"GB";
                //
                //    } else if (hshtgvalidatedKey === "Screen") {
                //
                //        sanitizedAnnotationsObj[hshtgvalidatedKey] = hshtgAnnotation.value+"-inch";
                //
                //    } else {
                //
                //        sanitizedAnnotationsObj[hshtgvalidatedKey] = hshtgAnnotation.value;
                //    }
                //}

            }


        });

        return sanitizedAnnotationsObj;
    };


    factory.getUserProfile = function (username) {

        var deferred = $q.defer();

        var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/getprofile?username=" + username;

        $http({method: 'GET', url: url}).
            then(function (response, status, headers, config) {

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;

    };


    factory.lookupItemDetails = function (postingId) {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.postingAPI + postingId
        }).then(function (response, status, headers, config) {

                deferred.resolve(response);

            }, function (response, status, headers, config) {

                deferred.reject(response);
            });

        return deferred.promise;
    };

    return factory;
}]);;/**
 * Created by braddavis on 1/3/15.
 */
htsApp.directive('transactionButtons', function () {
    return {
        restrict: 'E',
        scope: {
            result: '='
        },
        templateUrl: 'js/transactionButtons/partials/transactionButtons.partial.html',
        controller: ['$scope', 'transactionFactory', function ($scope, transactionFactory) {

            $scope.quickCompose = function () {
                transactionFactory.quickCompose($scope.result);
            };


            $scope.displayPhone = function () {
                transactionFactory.displayPhone($scope.result);
            };

            //CL item does not have phone and email so we open splash detailed view.
            $scope.openSplash = function () {
                transactionFactory.openSplash($scope.result);
            };


            //Ebay item.  Button links to item on ebay
            $scope.placeBid = function () {
                transactionFactory.placeBid($scope.result);
            };


            //HTS item.  Gathers date and time to propose for pickup.
            $scope.placeOffer = function () {
                transactionFactory.placeOffer($scope.result);
            };

        }]
    };
});;/**
 * Created by braddavis on 1/10/15.
 */
htsApp.factory('transactionFactory', ['Session', '$modal', '$log', 'authModalFactory', 'quickComposeFactory', 'splashFactory', '$window', '$state', function (Session, $modal, $log, authModalFactory, quickComposeFactory, splashFactory, $window, $state) {

    var transactionFactory = {};

    transactionFactory.quickCompose = function (result) {
        console.log('item we clicked on', result);

        if (!Session.userObj.user_settings.loggedIn) {

            authModalFactory.signInModal();

        } else {

            if (Session.userObj.user_settings.email_provider[0].value === "ask") {  //If user needs to pick their email provider

                var modalInstance = $modal.open({
                    templateUrl: '/js/transactionButtons/modals/email/partials/transactionButtons.modal.email.partial.html',
                    controller: 'quickComposeController',
                    resolve: {
                        result: function () {
                            return result;
                        }
                    }
                });

                modalInstance.result.then(function (reason) {

                }, function (reason) {
                    console.log(reason);
                    if (reason === "signUp") {
                        authModalFactory.signUpModal();
                    }
                    $log.info('Modal dismissed at: ' + new Date());
                });

            } else {  //User already set their default email provider

                quickComposeFactory.generateMailTo(Session.userObj.user_settings.email_provider[0].value, result);

            }
        }

    };


    transactionFactory.displayPhone = function (result) {

        if (!Session.userObj.user_settings.loggedIn) {

            authModalFactory.signInModal();

        } else {

            var modalInstance = $modal.open({
                templateUrl: '/js/transactionButtons/modals/phone/partials/transactionButtons.modal.phone.partial.html',
                controller: 'phoneModalController',
                resolve: {
                    result: function () {
                        return result;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if (reason === "signUp") {
                    authModalFactory.signUpModal();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

    };

    //CL item does not have phone and email so we open splash detailed view.
    transactionFactory.openSplash = function (result) {
        splashFactory.result = result;
        $state.go('results.splash', {id: result.external.source.url});
    };


    //Ebay item.  Button links to item on ebay
    transactionFactory.placeBid = function (result) {

        if (!Session.userObj.user_settings.loggedIn) {

            authModalFactory.signInModal();

        } else {

            $window.open(result.external.source.url);
        }
    };


    transactionFactory.showOriginal = function (result) {

        if (!Session.userObj.user_settings.loggedIn) {

            authModalFactory.signInModal();

        } else {

            $window.open(result.external.source.url);
        }

    };


    //HTS item.  Gathers date and time to propose for pickup.
    transactionFactory.placeOffer = function (result) {
        if(Session.userObj.user_settings.loggedIn) {  //If user logged In

            var modalInstance = $modal.open({
                templateUrl: '/js/transactionButtons/modals/placeOffer/partials/transactionButtons.modal.placeOffer.partial.html',
                controller: 'placeOfferController',
                resolve: {
                    result: function () {
                        return result;
                    }
                }
            });

            modalInstance.result.then(function (reason) {

            }, function (reason) {
                console.log(reason);
                if (reason === "signUp") {
                    authModalFactory.signUpModal();
                }
                $log.info('Modal dismissed at: ' + new Date());
            });

        } else {  //User is not logged in.

            authModalFactory.signUpModal();

        }
    };

    return transactionFactory;
}]);;htsApp.controller('quickComposeController', ['$scope', '$modalInstance', 'quickComposeFactory', 'Session', '$window', 'result', function ($scope, $modalInstance, quickComposeFactory, Session, $window, result) {

    $scope.userObj = Session.userObj;

    $scope.emailOptionsObject = [
        {name : "Use Default Mail Client", value : "mailto"},
        {name : "Gmail", value : "gmail"},
        {name : "Yahoo", value : "yahoo"},
        {name : "Hotmail", value : "hotmail"},
        {name : "AOL", value : "aol"}
    ];

    $scope.selected = "mailto";

    $scope.qcEmail = function () {

        if($scope.setDefaultEmailProvider){ //User requested we save their setting as default email provider
            quickComposeFactory.setDefaultEmailProvider($scope.selected);
        }


        quickComposeFactory.generateMailTo($scope.selected, result);


        $modalInstance.dismiss("auto-compose complete");
    };


    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);



htsApp.factory('quickComposeFactory', ['Session', '$window', function(Session, $window) {

    var newQuickCompose = {};

    //Open pre-filled out compose message window
    newQuickCompose.generateMailTo = function (provider, result) {

        var mailLink = "";

        if(!result.length) { //If only one result then append to TO: field.

            switch (provider) {
                case "gmail":
                    mailLink = "https://mail.google.com/mail/?view=cm&fs=1&to=" + result.annotations.source_account + "&su=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "yahoo":
                    mailLink = "http://compose.mail.yahoo.com/?to=" + result.annotations.source_account + "&subject=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "hotmail":
                    mailLink = "https://mail.live.com/default.aspx?rru=compose&to=" + result.annotations.source_account + "&subject=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "aol":
                    mailLink = "http://mail.aol.com/mail/compose-message.aspx?to=" + result.annotations.source_account + "&subject=" + result.heading + "&body=" + result.external.source.url;
                    $window.open(mailLink);
                    break;
                case "mailto":
                    mailLink = 'mailto:' + result.annotations.source_account + '?Subject=' + result.heading + '&body=' + result.external.source.url;
                    $window.open(mailLink);
                    break;
            }

        } else { //If multiple results then add comma delimited string to bcc field

            var bccString = "";

            for(i=0; i<result.length; i++) {
                if(result[i].annotations.source_account){
                    bccString += result[i].annotations.source_account+',';
                }
            }

            switch(provider){
                case "gmail":
                    mailLink = "https://mail.google.com/mail/?view=cm&fs=1&bcc="+bccString+"&su="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "yahoo":
                    mailLink = "http://compose.mail.yahoo.com/?bcc="+bccString+"&subject="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "hotmail":
                    mailLink = "https://mail.live.com/default.aspx?rru=compose&bcc="+bccString+"&subject="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "aol":
                    mailLink = "http://mail.aol.com/mail/compose-message.aspx?bcc="+bccString+"&subject="+"I'd like to buy your item..."+"&body="+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
                case "mailto":
                    mailLink = 'mailto:?bcc='+bccString+'&subject='+"I'd like to buy your item..."+'&body='+"HashtagSell.com - Re-thinking Online Classifieds";
                    $window.open(mailLink);
                    break;
            }
        }
    };



    //Saves the user email provider selection as default
    newQuickCompose.setDefaultEmailProvider = function(selectedProvider){

        var defaultEmail;

        switch (selectedProvider) {
            case 'ask':
                defaultEmail =  [{name : "Always Ask", value: "ask"}];
                break;
            case 'gmail':
                defaultEmail =  [{name : "Gmail", value : "gmail"}];
                break;
            case 'yahoo':
                defaultEmail =  [{name : "Yahoo", value : "yahoo"}];
                break;
            case 'hotmail':
                defaultEmail =  [{name : "Hotmail", value : "hotmail"}];
                break;
            case 'aol':
                defaultEmail =  [{name : "AOL", value : "aol"}];
                break;
            case 'mailto':
                defaultEmail =  [{name : "Use Default Mail Client", value : "mailto"}];
                break;
        }


        Session.setSessionValue("email_provider", defaultEmail, function () {
            console.log('default email updated');
        });
    };


    return newQuickCompose;
}]);;/**
 * Created by braddavis on 1/4/15.
 */
htsApp.controller('phoneModalController', ['$scope', '$modalInstance', 'Session', 'result', function ($scope, $modalInstance, Session, result) {

    $scope.userObj = Session.userObj;

    $scope.result = result;

    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

}]);;/**
 * Created by braddavis on 1/4/15.
 */
htsApp.controller('placeOfferController', ['$scope', '$modalInstance', 'Session', 'result', 'ENV', '$filter', 'offersFactory', 'favesFactory', 'socketio', function ($scope, $modalInstance, Session, result, ENV, $filter, offersFactory, favesFactory, socketio) {

    //Logged in user details
    $scope.userObj = Session.userObj;

    //Item details
    $scope.result = result;

    //User must add proposal times before they are allowed to submit.
    $scope.disableSubmission = true;

    $scope.offer = {
        "proposedTimes": [],
        "username": $scope.userObj.user_settings.name
    };


    //Fired when user completes selecting time and date.
    $scope.onTimeSet = function (newDate, oldDate) {
        $scope.dropDownStatus.isOpen = false; //Closes date/time picker

        newDate = $filter('date')(newDate, "yyyy-MM-ddTHH:mm:ssZ");

        $scope.addProposedTime(newDate);

        //Clear the input field
        $scope.data.dateDropDownInput = null;

        console.log(newDate);
    };


    //Track the date/time picker dropdown status: open or closed
    $scope.dropDownStatus = {
        isOpen: false
    };


    //When offer modal is dismissed
    $scope.dismiss = function (reason) {
        $modalInstance.dismiss(reason);
    };

    $scope.addProposedTime = function (newDate) {
        $scope.offer.proposedTimes.push({
            'when': newDate,
            'where': result.external.threeTaps.location.formatted
        });

        $scope.disableSubmission = $scope.validateProposal();
    };

    $scope.removeProposedTime = function (index) {
        $scope.offer.proposedTimes.splice(index, 1);

        $scope.disableSubmission = $scope.validateProposal();
    };


    $scope.validateProposal = function () {
        return $scope.offer.proposedTimes.length < 1;
    };



    $scope.sendOffer = function () {

        socketio.joinPostingRoom($scope.result.postingId, 'inWatchList', function(){

            offersFactory.sendOffer($scope.result.postingId, $scope.offer).then(function (response) {

                $scope.dismiss("offer sent");

            }, function (err) {

                $scope.dismiss("error");

                alert(err);

            });

        }); //Join the room of each posting the user places an offer on.

    };

}]);;/**
 * Created by braddavis on 10/17/14.
 */
//Controller catches the sign-in process from the sign-in modal and passes it to our authFactory
htsApp.controller('userMenu', ['$scope', 'Session', 'authModalFactory', '$modal', 'newPostFactory', function ($scope, Session, authModalFactory, $modal, newPostFactory) {

    $scope.userObj = Session.userObj;

    $scope.logout = function () {

        Session.destroy();

    };

    $scope.signIn = function (size) {

        authModalFactory.signInModal();

    };


    $scope.signUp = function (size) {

        authModalFactory.signUpModal();
    };


    $scope.checkEmail = function (size) {

        authModalFactory.checkEmailModal();

    };


    $scope.forgotPassword = function (size) {

        authModalFactory.forgotPasswordModal();
    };



    $scope.newPost = function () {

        var modalInstance = $modal.open({
            templateUrl: '/js/newPost/modals/newPost/partials/newpost.html',
            controller: 'newPostModal',
            size: 'lg',
            resolve: {
                mentionsFactory: function () {
                    return newPostFactory;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.modalContent.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };


}]);;/**
 * Created by braddavis on 2/16/15.
 */

htsApp.factory('utilsFactory', ['ENV', function (ENV) {

    var factory = {};

    //Converts objects to bracket notation string.
    factory.bracketNotationURL = function (params, bracketURL, urlParts) {

        urlParts = urlParts || [];
        var index = 0;

        for (var prop in params) {

            index++;
            //console.log('index Counter: ',index);

            if(params.hasOwnProperty(prop)) {

                //console.log('prop: ', prop);
                //console.log('parms[prop]: ', params[prop]);
                //console.log('urlParts.length:', urlParts.length);
                //console.log('bracketURL Before: ', bracketURL);

                if (!bracketURL && !urlParts.length) {
                    bracketURL = '?' + prop;
                } else if (index > 1 && urlParts.length && bracketURL.indexOf('[')===-1) {
                    bracketURL = '&' + prop;
                } else if (index > 1 && urlParts.length && bracketURL.indexOf('[')!==-1) {
                    bracketURL = bracketURL.replace(/\[(.+?)\]/g, "["+prop+"]");
                } else {
                    bracketURL += '[' + prop + ']';
                }

                //console.log('bracketURL After: ', bracketURL);


                if (typeof params[prop] === "object" && params[prop] !== null && params[prop].constructor !== Array) {

                    //console.log('RECURSING!');
                    //console.log('~~~~~~~~~~~~~~~~~~~');

                    factory.bracketNotationURL(params[prop], bracketURL, urlParts);

                } else {

                    var finalBracketURL = bracketURL;

                    if(params[prop].constructor === Array) {
                        finalBracketURL += '=' + params[prop].join();
                    } else {
                        finalBracketURL += '=' + params[prop];
                    }

                    urlParts.push(finalBracketURL);

                    //console.log(urlParts);
                    //console.log('~~~~~~~~~~~~~~~~~~~');

                }
            }
        }

        return urlParts.join('');

    };


    return factory;
}]);;/**
 * Created by braddavis on 5/1/15.
 */
htsApp.factory('categoryFactory', ['$http', '$q', 'ENV', function ($http, $q, ENV) {
    var factory = {};

    factory.lookupCategories = function () {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.groupingsAPI
        }).then(function (response, status, headers, config) {

            console.log('reference api response', response);

            deferred.resolve(response);

        }, function (response, status, headers, config) {

            deferred.reject(response);
        });

        return deferred.promise;
    };


    return factory;
}]);;/**
 * Created by braddavis on 4/23/15.
 */
htsApp.factory('ebayFactory', ['$q', '$http', '$window', '$rootScope', '$timeout',  '$interval', 'ENV', 'Session', 'Notification', function ($q, $http, $window, $rootScope, $timeout, $interval, ENV, Session, Notification) {

    var factory = {};


    factory.publishToEbay = function (newPost) {

        var deferred = $q.defer();

        var ebay = Session.getSessionValue('ebay');

        var payload = {
            "ebay": true
        };

        //We already have ebay token for user.. just push to ebay
        if(!factory.isEmpty(ebay)) {

            $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).
                success(function (response) {
                    deferred.resolve(response);
                }).
                error(function (response) {

                    deferred.reject(response);

                });

        } else {

            factory.getEbaySessionID().then(function (response) {
                Session.setSessionValue('ebay', response.data.ebay, function () {

                    $http.post(ENV.postingAPI + newPost.postingId + '/publish', payload).
                        success(function (response) {
                            deferred.resolve(response);
                        }).
                        error(function (response) {

                            deferred.reject(response);

                        });
                });
            }, function(errResponse) {
                //$scope.ebay.sessionId = errResponse.data.sessionId;
                //$scope.ebay.err = errResponse.data.ebay.Errors.LongMessage;

                Notification.error({
                    title: 'Manually link eBay account',
                    message: 'After completing eBay authorization please click the big red button below.',
                    delay: 10000
                });  //Send the webtoast
            });

        }

        return deferred.promise;
    };



    factory.getEbaySessionID = function () {

        var deferred = $q.defer();

        var w = $window.open(ENV.htsAppUrl + "/ebayauth", "", "width=1020, height=500");

        $http({
            method: 'GET',
            url: ENV.ebayAuth + '/sessionId'
        }).then(function (response) {

            var sessionId = response.data.GetSessionIDResponse.SessionID;
            var ebaySignInPage = ENV.ebaySignIn + '?SignIn&RUName=' + ENV.ebayRuName + '&SessID=' + sessionId;
            w.location = ebaySignInPage;

            var attemptCount = 0;

            var fetchTokenInterval = $interval(function () {
                $http({
                    method: 'GET',
                    url: ENV.ebayAuth + '/fetchToken',
                    params: {'sessionId' : sessionId}
                }).then(function (response) {

                    console.log(response);

                    if(response.data.success) {

                        w.close();

                        $interval.cancel(fetchTokenInterval);
                        deferred.resolve(response);

                    } else if(attemptCount === 50) {

                        $interval.cancel(fetchTokenInterval);

                        response.data.sessionId = sessionId;

                        deferred.reject(response);

                    } else {

                        attemptCount++;
                        console.log(attemptCount);

                    }

                });
            }, 2000);

            //deferred.resolve(response);

        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };


    factory.manuallyGetEbayToken = function (sessionId) {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ENV.ebayAuth + '/fetchToken',
            params: {'sessionId' : sessionId}
        }).then(function (response) {

            deferred.resolve(response);

        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };


    factory.disconnectEbay = function () {
        Session.setSessionValue('ebay', {}, function () {
            console.log('ebay account disconnected!');
        });
    };







    // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    factory.isEmpty = function(obj) {

        // null and undefined are "empty"
        if (obj === null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    };



    return factory;

}]);;/**
 * Created by braddavis on 4/23/15.
 */
htsApp.factory('facebookFactory', ['$q', 'ENV', 'Session', 'ezfb', function ($q, ENV, Session, ezfb) {

    var factory = {};

    factory.publishToWall = function (newPost) {

        var deferred = $q.defer();

        var facebook = Session.getSessionValue('facebook');

        console.log('facebook tokens', facebook);

        var currentDate = new Date();

        //WE already have facebook token for user.. just post to facebook.
        //if(!factory.isEmpty(facebook) && facebook.tokenExpiration > currentDate || !facebook.tokenExpiration) {
        if((!factory.isEmpty(facebook)  &&  facebook.tokenExpiration > currentDate) || (!factory.isEmpty(facebook)  &&  !facebook.tokenExpiration)) {

            ezfb.api('/me/feed', 'post',
                {
                    message: ENV.htsAppUrl + '/fb/' + newPost.postingId,
                    link: ENV.htsAppUrl + '/fb/' + newPost.postingId,
                    access_token: facebook.token
                },
                function (response) {

                    if (response.error) {

                        deferred.reject(response);

                    } else {

                        deferred.resolve(response);

                    }
                }
            );

        } else { //No facebook token for user.

            /**
             * Calling FB.login with required permissions specified
             * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
             */
            ezfb.login(function (res) { //login to facebook with scope email, and publish_actions
                if (res.authResponse) {
                    console.log('res AuthResponse', res);

                    var t = new Date();
                    t.setSeconds(res.authResponse.expiresIn);

                    var facebookCreds = {};
                    facebookCreds.id = res.authResponse.userID;
                    facebookCreds.token = res.authResponse.accessToken;
                    facebookCreds.tokenExpiration = t;

                    ezfb.api('/me', function (res) {  //Get email address from user now that we are authenticated
                        //$scope.apiMe = res;
                        console.log('apiMe', res);

                        facebookCreds.email = res.email;
                        facebookCreds.name = res.first_name + ' ' + res.last_name;

                        console.log(facebookCreds);

                        Session.setSessionValue('facebook', facebookCreds, function () {  //persist the facebook token in database so we don't have to do this again

                            ezfb.api('/me/feed', 'post',  //Post to facebook
                                {
                                    message: ENV.htsAppUrl + '/fb/' + newPost.postingId,
                                    link: ENV.htsAppUrl + '/fb/' + newPost.postingId,
                                    access_token: facebookCreds.token
                                },
                                function (response) {

                                    if (response.error) {

                                        deferred.reject(response);

                                    } else {

                                        deferred.resolve(response);

                                    }
                                }
                            );

                        });

                    });

                }
            }, {scope: 'email, publish_actions'});

        }

        return deferred.promise;
    };


    //Clears facebook token and creds from server permanently.
    factory.disconnectFacebook = function () {
        Session.setSessionValue('facebook', {}, function () {
            console.log('facebook account disconnected!');
        });
    };





    // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    factory.isEmpty = function(obj) {

        // null and undefined are "empty"
        if (obj === null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    };



    return factory;

}]);;/**
 * Created by braddavis on 4/23/15.
 */
htsApp.factory('twitterFactory', ['$q', '$http', '$window', '$interval', 'ENV', 'Session', function ($q, $http, $window, $interval, ENV, Session) {

    var factory = {};

    factory.publishToTwitter = function (newPost) {

        var deferred = $q.defer();

        var twitter = Session.getSessionValue('twitter');

        //We already have twitter token for user.. just post to twitter.
        if(!factory.isEmpty(twitter)) {

            $http({
                method: 'POST',
                url: ENV.htsAppUrl + '/publishTweet',
                data: {
                    'status' : ENV.htsAppUrl + '/tw/' + newPost.postingId,
                    'token': twitter.token,
                    'tokenSecret': twitter.tokenSecret
                }
            }).then(function (response) {

                deferred.resolve(response);

            }, function (err) {

                deferred.reject(err);

            });

        } else { //No twitter token for user.

            var w = $window.open(ENV.htsAppUrl + "/auth/twitter", "", "width=1020, height=500");

            var attemptCount = 0;

            var fetchTokenInterval = $interval(function () {

                Session.getUserFromServer().then(function (response) {

                    console.log(response);

                    if(response.user_settings.linkedAccounts.twitter.token) {

                        $interval.cancel(fetchTokenInterval);

                        w.close();

                        Session.create(response);

                        $http({
                            method: 'POST',
                            url: ENV.htsAppUrl + '/publishTweet',
                            data: {
                                'status' : ENV.htsAppUrl + '/tw/' + newPost.postingId,
                                'token': response.user_settings.linkedAccounts.twitter.token,
                                'tokenSecret': response.user_settings.linkedAccounts.twitter.tokenSecret
                            }
                        }).then(function (response) {

                            deferred.resolve(response);

                        }, function (err) {

                            deferred.reject(err);

                        });


                    } else if(attemptCount === 50) {

                        $interval.cancel(fetchTokenInterval);

                        deferred.reject(response);

                    } else {

                        attemptCount++;
                        console.log(attemptCount);

                    }

                });

            }, 2000);

        }

        return deferred.promise;
    };


    //Clears Twitter token and creds from server permanently.
    factory.disconnectTwitter = function () {
        Session.setSessionValue('twitter', {}, function () {
            console.log('twitter account disconnected!');
        });
    };





    // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    factory.isEmpty = function(obj) {

        // null and undefined are "empty"
        if (obj === null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    };



    return factory;

}]);