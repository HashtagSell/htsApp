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
        state('payment', {
            url: "/payment/:postingId/:offerId",
            views: {
                'root': {
                    controller: 'paymentController',
                    templateUrl: 'js/payment/partials/payment.partial.html'
                }
            }
        }).
        state('review', {
            url: "/review/:postingId/:offerId/:userId",
            views: {
                'root': {
                    controller: 'peerReviewController',
                    templateUrl: 'js/peerReview/partials/peerReview.partial.html'
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
            resolve: {
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
        template: '<span ng-class="{starHighlighted: favorited, star: !favorited}" ng-click="toggleFave(result); $event.stopPropagation();" tooltip="{{tooltipMessage}}" tooltip-placement="bottom" tooltip-trigger="mouseenter"></span>',
        controller: ['$scope', '$element', 'favesFactory', 'Session', 'authModalFactory', 'socketio', 'sideNavFactory', '$timeout', function ($scope, $element, favesFactory, Session, authModalFactory, socketio, sideNavFactory, $timeout) {

            //console.log(Session.userObj);
            //
            if(Session.userObj.user_settings.loggedIn) {
                favesFactory.checkFave($scope.result, function (response) {
                    $scope.favorited = response;

                    $scope.tooltipMessage = 'please wait';

                    if($scope.favorited){
                        $scope.tooltipMessage = 'Remove from watch list';
                    } else {
                        $scope.tooltipMessage = 'Add to watch list';
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
                            sideNavFactory.defaultMenu[2].active = true;

                            $timeout(function () {
                                sideNavFactory.defaultMenu[2].active = false;
                            }, 250);

                            $scope.favorited = false;
                            $scope.tooltipMessage = 'Add to watch list';
                            socketio.leavePostingRoom(item.postingId, 'inWatchList'); //Join the room of each posting the user owns.

                        });
                    }
                } else {

                    authModalFactory.signInModal();

                }
            };
        }]
    };
});


htsApp.filter('capitalize', function() {
    return function(input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    };
});



htsApp.directive('subMerchant', function () {
   return {
       templateUrl: 'js/submerchant/partials/submerchant.partial.html',
       controller: ['$scope', '$http', '$q', 'ENV', function ($scope, $http, $q, ENV) {

           $scope.subMerchantForm = {
               business: {
                   isbusinessAccount: null,
                   businessOptionsDropdown: [
                       {name: 'No', value: false},
                       {name: 'Yes', value: true}
                   ],
                   addressLookup: null
               },
               individual: {
                   addressLookup: null
               },
               destination: {
                   disperseToBank: null,
                   disperseToVenmo: null
               }
           };

           $scope.subMerchant = {
               business: {
                   legal_name: null,
                   tax_id: null,
                   address: {
                       street_address: null,
                       locality: null,
                       region: null,
                       postal_code: null,
                   }
               },
               individual: {
                   first_name: null,
                   last_name: null,
                   email: null,
                   date_of_birth: null,
                   address: {
                       street_address: null,
                       locality: null,
                       region: null,
                       postal_code: null
                   },
               },
               funding: {
                   destination: null,
                   email: null,
                   mobile_phone: null,
                   account_number: null,
                   routing_number: null
               }
           };


           $scope.submitSubMerchant = function () {
               $http.post(ENV.paymentAPI + '/submerchant', {
                   subMerchant: $scope.subMerchant
               }).success(function(response){
                    console.log(response);
               }).error(function(err){
                    console.log(err);
               });
           };




            $scope.predictAddress = function (address) {

                return $scope.predictPlace(address).then(function (results) {
                    return results.map(function(item){
                        return item;
                    });
                });

            };





           $scope.predictPlace = function (address) {

               var defaultBounds = new google.maps.LatLngBounds(
                   new google.maps.LatLng(37.79738, -122.52464),
                   new google.maps.LatLng(37.68879, -122.36122)
               );

               //need to set bounds to cornwall/bodmin
               var locationRequest = {
                   input: address,
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



           $scope.setAddressComponents = function (placesObj, type){
               console.log(placesObj);
               console.log(type);

               var googleMaps = new google.maps.places.PlacesService(new google.maps.Map(document.createElement("map-canvas")));

               //capture the place_id and send to google maps for metadata about the place
               var request = {
                   placeId: placesObj.place_id
               };

               googleMaps.getDetails(request, function (placeMetaData, status) {

                   var street = '';
                   var street_number = '';

                   for(var i = 0; i < placeMetaData.address_components.length; i++){
                       var component = placeMetaData.address_components[i];

                       console.log(component);

                       for(var j = 0; j < component.types.length; j++){
                           var componentType = component.types[j];

                           console.log($scope.subMerchant);

                           if(componentType === "locality"){
                               $scope.subMerchant[type].address.locality = component.long_name;
                               break;
                           } else if(componentType === "administrative_area_level_1"){
                               $scope.subMerchant[type].address.region = component.short_name;
                               break;
                           } else if(componentType === "route") {
                               street = component.long_name;
                               break;
                           } else if(componentType === "postal_code") {
                               $scope.subMerchant[type].address.postal_code = component.long_name;
                               break;
                           } else if(componentType === "street_number") {
                               street_number = component.long_name;
                               break;
                           }
                       }
                   }

                   $scope.subMerchant[type].address.street_address = street_number + ' ' + street;

               });

           };

       }]
   };
});



//Google returns City, St, United States.  this function removes unnecessary united states from string for awesome bar
htsApp.filter('awesomecity', function() {
    return function(longCityName) {

        var awesomeCity;

        if(longCityName) {
            // do some bounds checking here to ensure it has that index
            awesomeCity = longCityName.replace(/,[^,]+$/, "");
        } else {
            awesomeCity = "Nearby";
        }

        return awesomeCity;
    };
});
