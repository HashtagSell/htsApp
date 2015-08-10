/**
 * Created by braddavis on 1/6/15.
 */
htsApp.controller('newPostModal', ['$scope', '$http', '$q', '$modalInstance', '$timeout', '$state', '$modal', '$filter', 'mentionsFactory', '$templateCache', 'ENV', 'Session', 'Notification', 'modalConfirmationService', function ($scope, $http, $q, $modalInstance, $timeout, $state, $modal, $filter, mentionsFactory, $templateCache, ENV, Session, Notification, modalConfirmationService) {


    $scope.showDemo = false;
    $scope.hideDemo = function () {
        $scope.showDemo = !$scope.showDemo;
        if($scope.showDemo) {
            $scope.img = '//static.hashtagsell.com/tutorialRelated/sell_box_animation_short.gif';

            $timeout(function () {
                $scope.showDemo = false;
            }, 22720);

        } else {
            $scope.img = '//static.hashtagsell.com/tutorialRelated/sell_box_static.png';
        }
        //scope.currentlyPlaying = false;
    };

    $scope.clearPlaceholder = function () {
        if (!$scope.placeholderCleared) {
            console.log("clearing placeholder");
            document.getElementById("htsPost").innerHTML = "";
            $scope.resetAll();
            $scope.placeholderCleared = true;
        } else {
            console.log('placeholder already cleared');
        }
    };

    $scope.toggleExampleVisibility = true;
    $scope.clearExampleReminder = function () {
        $scope.toggleExampleVisibility = false;
    };

    $scope.manualCategorySelect = mentionsFactory.manualCategorySelect;

    $scope.resetAll = function () {
        $scope.jsonObj = mentionsFactory.setJsonTemplate();
        mentionsFactory.alerts = {
            banners: []
        };
    };
    $scope.resetAll();





    //$scope.$watch('jsonObj', function(newValue, oldValue) {
    //        console.log(newValue);
    //        $scope.jsonObjDebug = JSON.stringify(newValue, null, "    ");
    //    }
    //);


    $scope.allCategories = [
        {
            "code": "AAAA",
            "name": "animals",
            "categories": [
                {
                    "code": "APET",
                    "name": "pets"
                },
                {
                    "code": "ASUP",
                    "name": "supplies"
                },
                {
                    "code": "AOTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "CCCC",
            "name": "community",
            "categories": [
                {
                    "code": "CCNW",
                    "name": "classes and workshops"
                },
                {
                    "code": "COMM",
                    "name": "events"
                },
                {
                    "code": "CGRP",
                    "name": "groups"
                },
                {
                    "code": "CLNF",
                    "name": "lost and found"
                },
                {
                    "code": "CRID",
                    "name": "rideshares"
                },
                {
                    "code": "CVOL",
                    "name": "volunteers"
                },
                {
                    "code": "COTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "SSSS",
            "name": "for sale",
            "categories": [
                {
                    "code": "SANT",
                    "name": "antiques"
                },
                {
                    "code": "SAPP",
                    "name": "apparel"
                },
                {
                    "code": "SAPL",
                    "name": "appliances"
                },
                {
                    "code": "SANC",
                    "name": "art and crafts"
                },
                {
                    "code": "SKID",
                    "name": "babies and kids"
                },
                {
                    "code": "SBAR",
                    "name": "barters"
                },
                {
                    "code": "SBIK",
                    "name": "bicycles"
                },
                {
                    "code": "SBIZ",
                    "name": "businesses"
                },
                {
                    "code": "SCOL",
                    "name": "collections"
                },
                {
                    "code": "SEDU",
                    "name": "educational"
                },
                {
                    "code": "SELE",
                    "name": "electronics and photo"
                },
                {
                    "code": "SFNB",
                    "name": "food and beverage"
                },
                {
                    "code": "SFUR",
                    "name": "furniture"
                },
                {
                    "code": "SGAR",
                    "name": "garage sales"
                },
                {
                    "code": "SGFT",
                    "name": "gift cards"
                },
                {
                    "code": "SHNB",
                    "name": "health and beauty"
                },
                {
                    "code": "SHNG",
                    "name": "home and garden"
                },
                {
                    "code": "SIND",
                    "name": "industrial"
                },
                {
                    "code": "SJWL",
                    "name": "jewelry"
                },
                {
                    "code": "SLIT",
                    "name": "literature"
                },
                {
                    "code": "SMNM",
                    "name": "movies and music"
                },
                {
                    "code": "SMUS",
                    "name": "musical instruments"
                },
                {
                    "code": "SRES",
                    "name": "restaurants"
                },
                {
                    "code": "SSNF",
                    "name": "sports and fitness"
                },
                {
                    "code": "STIX",
                    "name": "tickets"
                },
                {
                    "code": "STOO",
                    "name": "tools"
                },
                {
                    "code": "STOY",
                    "name": "toys and hobbies"
                },
                {
                    "code": "STVL",
                    "name": "travel"
                },
                {
                    "code": "SWNT",
                    "name": "wanted"
                },
                {
                    "code": "SOTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "RRRR",
            "name": "real estate",
            "categories": [
                {
                    "code": "RCRE",
                    "name": "commercial real estate"
                },
                {
                    "code": "RHFR",
                    "name": "housing for rent"
                },
                {
                    "code": "RHFS",
                    "name": "housing for sale"
                },
                {
                    "code": "RSUB",
                    "name": "housing sublets"
                },
                {
                    "code": "RSWP",
                    "name": "housing swaps"
                },
                {
                    "code": "RLOT",
                    "name": "lots and land"
                },
                {
                    "code": "RPNS",
                    "name": "parking and storage"
                },
                {
                    "code": "RSHR",
                    "name": "room shares"
                },
                {
                    "code": "RVAC",
                    "name": "vacation properties"
                },
                {
                    "code": "RWNT",
                    "name": "want housing"
                },
                {
                    "code": "ROTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "SVCS",
            "name": "services",
            "categories": [
                {
                    "code": "SVCC",
                    "name": "creative"
                },
                {
                    "code": "SVCE",
                    "name": "education"
                },
                {
                    "code": "SVCF",
                    "name": "financial"
                },
                {
                    "code": "SVCM",
                    "name": "health"
                },
                {
                    "code": "SVCH",
                    "name": "household"
                },
                {
                    "code": "SVCP",
                    "name": "professional"
                },
                {
                    "code": "SVCO",
                    "name": "other"
                }
            ]
        },
        {
            "code": "ZZZZ",
            "name": "uncategorized",
            "categories": [
                {
                    "code": "ZOTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "VVVV",
            "name": "vehicles",
            "categories": [
                {
                    "code": "VAUT",
                    "name": "autos"
                },
                {
                    "code": "VMOT",
                    "name": "motorcycles"
                },
                {
                    "code": "VMPT",
                    "name": "motorcycle parts"
                },
                {
                    "code": "VPAR",
                    "name": "parts"
                },
                {
                    "code": "VOTH",
                    "name": "other"
                }
            ]
        },
        {
            "code": "JJJJ",
            "name": "jobs",
            "categories": [
                {
                    "code": "JACC",
                    "name": "accounting"
                },
                {
                    "code": "JADM",
                    "name": "administrative"
                },
                {
                    "code": "JAER",
                    "name": "aerospace and defense"
                },
                {
                    "code": "JANL",
                    "name": "analyst"
                },
                {
                    "code": "JANA",
                    "name": "animals and agriculture"
                },
                {
                    "code": "JARC",
                    "name": "architecture"
                },
                {
                    "code": "JART",
                    "name": "art"
                },
                {
                    "code": "JAUT",
                    "name": "automobile"
                },
                {
                    "code": "JBEA",
                    "name": "beauty"
                },
                {
                    "code": "JBIZ",
                    "name": "business development"
                },
                {
                    "code": "JWEB",
                    "name": "computer and web"
                },
                {
                    "code": "JCST",
                    "name": "construction and facilities"
                },
                {
                    "code": "JCON",
                    "name": "consulting"
                },
                {
                    "code": "JCUS",
                    "name": "customer service"
                },
                {
                    "code": "JDES",
                    "name": "design"
                },
                {
                    "code": "JEDU",
                    "name": "education"
                },
                {
                    "code": "JENE",
                    "name": "energy"
                },
                {
                    "code": "JENG",
                    "name": "engineering"
                },
                {
                    "code": "JENT",
                    "name": "entertainment and media"
                },
                {
                    "code": "JEVE",
                    "name": "events"
                },
                {
                    "code": "JFIN",
                    "name": "finance"
                },
                {
                    "code": "JFNB",
                    "name": "food and beverage"
                },
                {
                    "code": "JGIG",
                    "name": "gigs"
                },
                {
                    "code": "JGOV",
                    "name": "government"
                },
                {
                    "code": "JHEA",
                    "name": "healthcare"
                },
                {
                    "code": "JHOS",
                    "name": "hospitality and travel"
                },
                {
                    "code": "JHUM",
                    "name": "human resources"
                },
                {
                    "code": "JMNT",
                    "name": "installation, maintenance and repair"
                },
                {
                    "code": "JINS",
                    "name": "insurance"
                },
                {
                    "code": "JINT",
                    "name": "international"
                },
                {
                    "code": "JLAW",
                    "name": "law enforcement"
                },
                {
                    "code": "JLEG",
                    "name": "legal"
                },
                {
                    "code": "JMAN",
                    "name": "management and directorship"
                },
                {
                    "code": "JMFT",
                    "name": "manufacturing and mechanical"
                },
                {
                    "code": "JMAR",
                    "name": "marketing, advertising and public relations"
                },
                {
                    "code": "JNON",
                    "name": "non-profit"
                },
                {
                    "code": "JOPS",
                    "name": "operations and logistics"
                },
                {
                    "code": "JPHA",
                    "name": "pharmaceutical"
                },
                {
                    "code": "JPRO",
                    "name": "product, project and program management"
                },
                {
                    "code": "JPUR",
                    "name": "purchasing"
                },
                {
                    "code": "JQUA",
                    "name": "quality assurance"
                },
                {
                    "code": "JREA",
                    "name": "real estate"
                },
                {
                    "code": "JREC",
                    "name": "recreation"
                },
                {
                    "code": "JRES",
                    "name": "resumes"
                },
                {
                    "code": "JRNW",
                    "name": "retail and wholesale"
                },
                {
                    "code": "JSAL",
                    "name": "sales"
                },
                {
                    "code": "JSCI",
                    "name": "science"
                },
                {
                    "code": "JSEC",
                    "name": "security"
                },
                {
                    "code": "JSKL",
                    "name": "skilled trade and general labor"
                },
                {
                    "code": "JTEL",
                    "name": "telecommunications"
                },
                {
                    "code": "JTRA",
                    "name": "transportation"
                },
                {
                    "code": "JVOL",
                    "name": "volunteer"
                },
                {
                    "code": "JWNP",
                    "name": "writing and publishing"
                },
                {
                    "code": "JOTH",
                    "name": "other"
                }
            ]
        }
    ];


    //TODO: Handle auctions
    $scope.macros = {
        'obo': '*Or Best Offer*'
    };

    $scope.isEmpty = function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    };

    $scope.dismiss = function (reason) {

        var modalOptions = {
            closeButtonText: 'No',
            actionButtonText: 'Yes',
            headerText: 'Cancel New Post?',
            bodyText: 'Your new post has not been saved.  Are you sure you want to cancel your new post?'
        };

        modalConfirmationService.showModal({}, modalOptions).then(function (result) {
            $scope.resetAll();
            $modalInstance.dismiss(reason);
        });
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
                    $scope.$apply($scope.numImages);
                },
                'uploadprogress': function(progress) {
                    //$scope.uploadProgress = progress;
                    //console.log($scope.uploadProgress);
                },
                'totaluploadprogress': function(progress) {
                    if(progress) {
                        $scope.uploadProgress = progress;
                        $scope.$apply($scope.uploadProgress);
                        if (progress < 100) {
                            $scope.uploadMessage = Math.round(progress) + '%';
                            $scope.$apply($scope.uploadProgress);
                        } else if (progress === 100) {
                            $scope.uploadMessage = 'Preparing photos.. please wait.';
                            $scope.$apply($scope.uploadProgress);
                        }
                    }
                }
            },
            'init': {}
        };
    });


    $scope.closeAlert = function(index) {
        $scope.alerts.banners.splice(index, 1);
    };

    $scope.alerts = mentionsFactory.alerts;

    $scope.validatePost = function () {

        $scope.alerts.banners = [];

        var newPost = $scope.jsonObj;

        if (newPost.hashtags.length) {
            if (newPost.category) {
                if (!$scope.isEmpty(newPost.location)) {
                    $scope.processPost();
                } else {
                    $scope.alerts.banners.push({
                        type: 'danger',
                        msg: 'Use the @ symbol in your post to specify where the buyer should pickup the item.'
                    });
                }
            } else {
                $scope.alerts.banners.push({
                    type: 'danger',
                    msg: 'Add more #\'s to describe your item for sale, or manually specify a category.'
                });

                $scope.jsonObj.category_name = "other";
                $scope.jsonObj.category = "ZOTH";
            }
        } else {
            $scope.alerts.banners.push({
                type: 'danger',
                msg: 'Use the # symbol in your post to describe the item you\'re selling.  Hint: You can add more than one hashtag if you want.'
            });
        }

    };


    $scope.processPost = function () {

        if(Session.userObj.user_settings.loggedIn) {

            if ($scope.numImages) {
                $scope.dropzoneConfig.init();
            } else {
                $scope.publishPost();
            }
        } else {

            $state.go('signup');

        }
    };


    //Sellbox directive calls this to update model when a special character is removed
    $scope.cleanModel = function(type, mentionToRemove) {
        mentionsFactory.cleanModel(type, mentionToRemove);
    };


    $scope.publishPost = function () {
        var newPost = $scope.jsonObj;

        newPost.username = Session.userObj.user_settings.name;

        //loop through the hashtags and formulate the heading of post
        newPost.heading = '';
        for (var i = 0; i < newPost.hashtags.length; i++) {
            if (i !== newPost.hashtags.length - 1) {
                newPost.heading += newPost.hashtags[i] + " ";
            } else {
                newPost.heading += newPost.hashtags[i];
            }
            newPost.hashtags[i] = newPost.hashtags[i]; //Remove all the info we used to gather meta-data
        }

        //Josh's posting API
        $http.post(ENV.postingAPI, newPost).
            success(function(posting) {
                console.log("-----Post Complete----");
                console.log(posting);
                $modalInstance.dismiss({reason: "stageOneSuccess", post: posting});

                //Submit for precaching
                $http.post(ENV.precacheAPI, {posting: posting}).success(function(response){
                    console.log('precache success', response);
                }).error(function(err){
                    console.log('precache error:', err);
                });

                $scope.resetAll();
            }).
            error(function(data, status, headers, config) {

                console.log(data);

                Notification.error({
                    title: data.name,
                    message: data.message,
                    delay: 10000
                });  //Send the webtoast
            });
    };

    //========= # Products =========
    $scope.searchProducts = function (term) {
        if (term) {
            mentionsFactory.predictProduct(term).then(function (results) {
                $scope.products = results;
                //console.log("Here is scope.products", $scope.products);
            });
        } else {
            $scope.products = [
                {
                    value: "Describe your item for sale",
                    demoText: true
                }
            ];
        }
    };

    $scope.getProductTextRaw = function (product) {
        console.log('============================');
        console.log(product);
        console.log('============================');
        if(!product.demoText) {
            if (mentionsFactory.getProductMetaData(product)) {
                return '<span class="mention-highlighter" contentEditable="false">#' + product.value + '</span>';
            } else {
                //$scope.alerts.banners.push({
                //    type: 'danger',
                //    msg: 'Duplicate hashtags not necessary'
                //});
                return '<span class="mention-highlighter" contentEditable="false">#' + product.value + '</span>';
            }
        }
    };


    //========= @ Places =========
    $scope.map = mentionsFactory.googleMap;

    $scope.searchPlaces = function (term) {

        if (term) {
            if($scope.isEmpty($scope.jsonObj.location)) {
                mentionsFactory.predictPlace(term).then(function (results) {
                    $scope.places = results;
                    //console.log("Here is scope.places", $scope.places);
                });
            }
        } else {
            $scope.places = [
                {
                    description: "Specify a landmark OR address to pick up item",
                    demoText: true
                }
            ];
        }
    };

    $scope.getPlacesTextRaw = function (selectedPlace) {
        if(!selectedPlace.demoText) {
            if (mentionsFactory.getPlaceMetaData(selectedPlace)) {
                return '<span class="mention-highlighter-location" contentEditable="false">@' + selectedPlace.description + '</span>';
            } else {
                $scope.alerts.banners.push({
                    type: 'danger',
                    msg: 'Please only use one @ symbol in your post'
                });
            }
        }
    };

    //========= $ Prices =========
    $scope.searchPrice = function (term) {
        if (term) {
            if($scope.isEmpty($scope.jsonObj.price)) {
                $scope.prices = mentionsFactory.predictPrice(term);
                //console.log("here is scope.prices", $scope.prices);
            }
        } else {
            $scope.prices = [
                {
                    suggestion: "Type your asking price",
                    demoText: true
                }
            ];
        }
    };

    $scope.getPricesTextRaw = function (selectedPrice) {
        if(!selectedPrice.demoText) {
            if (mentionsFactory.getPriceMetaData(selectedPrice)) {
                //if($scope.jsonObj.price_avg) {
                //    if (selectedPrice.value <= Math.floor($scope.jsonObj.price_avg)) {
                //        return '<span class="mention-highlighter-price" contentEditable="false">' + selectedPrice.suggestion + '</span>';
                //    } else {
                //        var message = 'Your price is higher than our calculated average: ' + $filter('currency')(Math.floor($scope.jsonObj.price_avg), '$', 0);
                //        $scope.alerts.banners.push({
                //            type: 'warning',
                //            msg: message
                //        });
                //        return '<span class="mention-highlighter-price mention-highlighter-price-high" tooltip-placement="bottom" tooltip="Higher than average price" tooltip-trigger="mouseenter" contentEditable="false">' + selectedPrice.suggestion + '</span>';
                //    }
                //} else {
                    return '<span class="mention-highlighter-price" contentEditable="false">' + selectedPrice.suggestion + '</span>';
                //}
            } else {
                //$scope.alerts.banners.push({
                //    type: 'danger',
                //    msg: 'Please only use one $ symbol in your post.'
                //});
                console.log('new post Controller sees priceMetaData returned false.');
            }
        }
    };



    //Demo plays to describe how to sell an item
    //(function demo () {
    //    $timeout(function () {
    //        if (!$scope.demoCleared) {
    //            $(".mention-highlighter").triggerHandler('show');
    //        }
    //
    //        $timeout(function () {
    //            if (!$scope.demoCleared) {
    //                $(".mention-highlighter").triggerHandler('hide');
    //                $(".mention-highlighter-price").triggerHandler('show');
    //            }
    //
    //            $timeout(function () {
    //                if (!$scope.demoCleared) {
    //                    $(".mention-highlighter-price").triggerHandler('hide');
    //                    $(".mention-highlighter-location").triggerHandler('show');
    //                }
    //
    //                $timeout(function () {
    //                    if (!$scope.demoCleared) {
    //                        $(".mention-highlighter-location").triggerHandler('hide');
    //                        $(".sellModalButton").triggerHandler('show');
    //                    }
    //
    //                    $timeout(function () {
    //                        $(".sellModalButton").triggerHandler('hide');
    //                    }, 4000);
    //
    //                }, 4000);
    //
    //            }, 4000);
    //
    //        }, 4000);
    //
    //    }, 1000);
    //})();
    //$timeout(function () {
    //    $(".mention-highlighter").triggerHandler('show');
    //    $("div[content='# your item']").css('left', parseInt($("div[content='# your item']").css('left')) - 26 + 'px');
    //    $(".mention-highlighter-price").triggerHandler('show');
    //    $(".mention-highlighter-location").triggerHandler('show');
    //}, 200);

}]);