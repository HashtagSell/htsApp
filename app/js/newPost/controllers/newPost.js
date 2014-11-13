htsApp.controller('newPostController', ['$scope', '$modal', function ($scope, $modal) {

    $scope.newPost = function () {

        var ModalInstanceCtrl = ['$scope', '$http', '$q', '$modalInstance', '$modal', 'mentionsFactory', function ($scope, $http, $q, $modalInstance, $modal, mentionsFactory) {

            $scope.cleared = false;

            console.log("modal $scope", $scope);

            $scope.clearExample = function () {
                console.log("clearing contents");
                if (!$scope.cleared) {
                    document.getElementById("htsPost").innerHTML = "";
                    $scope.cleared = true;
                }
            };

            $scope.jsonObj = mentionsFactory.jsonTemplate;

            $scope.formatted_jsonObj = function () {
                return JSON.stringify($scope.jsonObj, null, 4);
            };

            $scope.macros = {
                'brb': 'Be right back',
                'omw': 'On my way',
                '(smile)': '<img src="http://a248.e.akamai.net/assets.github.com/images/icons/emoji/smile.png"' +
                    ' height="20" width="20">'
            };

            $scope.closePostCompose = function () {
                $modalInstance.dismiss('cancel');
            };


            $scope.dropzoneConfig = {
                'options': { // passed into the Dropzone constructor
                    paramName: "file", // The name that will be used to transfer the file
                    maxFilesize: 15, // MB
                    maxFiles: 25,
                    acceptedFiles: '.jpeg,.jpg,.png,.gif',
                    url: "/upload",
                    autoProcessQueue: false,
                    uploadMultiple: true,
                    parallelUploads: 10,
                    addRemoveLinks: true,
                    clickable: "#imageUpload",
                    previewsContainer: "#imgPreviewsContainer",
                    dictDefaultMessage: ''
                },
                'eventHandlers': {
                    'sendingmultiple': function (file, xhr, formData) {
                        console.log("sending for upload!");
                        //                console.log(file,xhr,formData);
                    },
                    'successmultiple': function (file, response) {

                        console.log(response);

                        var newPost = $scope.jsonObj;

                        newPost.images = response.images;

                        $scope.publishPost();


                    },
                    'addedfile': function () {
                        console.log("image added");
                        if ($scope.numImages) {
                            $scope.numImages + 1
                        } else {
                            $scope.numImages = 1;
                        }
                    },
                    'removedfile': function () {
                        console.log("image removed");
                        $scope.numImages - 1;
                    }
                },
                'init': {}
            };


            $scope.processPost = function () {

                if ($scope.numImages) {
                    $scope.dropzoneConfig.init();
                } else {
                    $scope.publishPost()
                }
            };


            $scope.publishPost = function () {
                console.log($scope.jsonObj);
                alert("publishing post");
                var newPost = $scope.jsonObj;

                //loop through the hashtags and formulat the heading of post
                newPost.heading = '';
                for (i = 0; i < newPost.mentions.hashtags.length; i++) {
                    if (!i == newPost.mentions.hashtags.length - 1) {
                        newPost.heading += newPost.mentions.hashtags[i].hashtag + " ";
                    } else {
                        newPost.heading += newPost.mentions.hashtags[i].hashtag;
                    }

                    newPost.mentions.hashtags[i] = newPost.mentions.hashtags[i].hashtag; //Remove all the info we used to gather meta-data
                }

                $http.post('/newpost', newPost).
                    success(function (status) {
                        console.log("-----Post Complete----");
                        console.log(status)
                    });
            };

            //========= # Products =========
            $scope.searchProducts = function (term) {
                if (term) {
                    mentionsFactory.predictProduct(term).then(function (results) {
                        $scope.products = results;
                        console.log("Here is scope.products", $scope.products);
                    });
                }
            };

            $scope.getProductTextRaw = function (product) {
                mentionsFactory.getProductMetaData(product).then(function (jsonTemplate) {
                    console.log(jsonTemplate);
                    console.log("done");
                });
                return '<span class="mention-highlighter" contentEditable="false">#' + product.value + '</span>';
            };


            //========= @ Places =========
            $scope.map = mentionsFactory.googleMap;

            $scope.searchPlaces = function (term) {
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
                return '<span class="mention-highlighter" contentEditable="false">@' + selectedPlace.description + '</span>';
            };

            //========= @ Prices =========
            $scope.searchPrice = function (term) {
                if (term) {
                    $scope.prices = mentionsFactory.predictPrice(term);
                    console.log("here is scope.prices", $scope.prices);
                }
            };

            $scope.getPricesTextRaw = function (selectedPrice) {
                mentionsFactory.getPriceMetaData(selectedPrice);
                return '<span class="mention-highlighter-price" contentEditable="false">$' + selectedPrice.suggestion + '</span>';
            };

        }];

        var modalInstance = $modal.open({
//                templateUrl: '/newpost/',
            templateUrl: 'js/newPost/partials/newpost.html',
            controller: ModalInstanceCtrl,
            resolve: {
                mentionsFactory: ['$q', '$http', function ($q, $http) {

                    var factory = {}; //init the factory


                    factory.jsonTemplate = {
                        "annotations": {},
                        "category": null,
                        "category_name": null,
                        "category_group": null,
                        "category_group_name": null,
                        "heading": null,
                        "html_body": null,
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
                        "hints": "Watch for hints as you type."
                    };


                    factory.predictProduct = function (term) {

                        var products = [];
                        var userTypedText = {value: term};

                        var deferred = $q.defer();

                        $http.jsonp('http://suggestqueries.google.com/complete/search?callback=?', {
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
                    }


                    factory.getProductMetaData = function (selectedProduct) {

                        var deferred = $q.defer();

                        this.jsonTemplate.mentions.hashtags.push({hashtag: selectedProduct.value, results: null});

                        console.log("here is our json template");
                        console.log(this.jsonTemplate);

                        //TODO: Omit Adult Categories if Safe_Search is on
                        //        if(!Session.getLoginStatus() || Session.getSessionValue("safe_search")){
                        //            console.log("Safe Search is on!");
                        //            POPULAR_CATEGORY_HASH_TABLESearchString+="~PPPP|~PMSM|~PMSW|~PWSM|~PWSW|~POTH|~MMMM|~MESC|~MFET|~MJOB|~MMSG|~MPNW|~MSTR|~MOTH";
                        //        } else {
                        //            POPULAR_CATEGORY_HASH_TABLESearchString = POPULAR_CATEGORY_HASH_TABLESearchString.substring(0, POPULAR_CATEGORY_HASH_TABLESearchString.length - 1);
                        //        }

                        $http.get('../search_old?', {
                            params: {
                                heading: selectedProduct.value,
                                source: 'CRAIG',
                                rpp: 99,
                                retvals: "price,category,annotations",
                                logic: true
                            }
                        }).success(function (data, status) {

                            //These are the only potential annotations we will ask the user for today.
                            var annotationsDictionary = new Hashtable();
                            annotationsDictionary.put("year", "year");
                            annotationsDictionary.put("condition", "condition");
                            annotationsDictionary.put("make", "make");
                            annotationsDictionary.put("title_status", "title status");
                            annotationsDictionary.put("model", "model");
                            annotationsDictionary.put("mileage", "mileage");
                            annotationsDictionary.put("transmission", "transmission type");
                            annotationsDictionary.put("paint_color", "color");
                            annotationsDictionary.put("type", "type");
                            annotationsDictionary.put("fuel", "fuel type");
                            annotationsDictionary.put("size", "size");
                            annotationsDictionary.put("bathrooms", "# of baths");
                            annotationsDictionary.put("no_smoking", "smoking preference");
                            annotationsDictionary.put("bedrooms", "# of rooms");
                            annotationsDictionary.put("dogs", "dog preference");
                            annotationsDictionary.put("cats", "cat preference");
                            annotationsDictionary.put("attached_garage", "garage location");
                            annotationsDictionary.put("laundry_on_site", "laundry & other amenities");
                            annotationsDictionary.put("sqft", "sq ft");
                            annotationsDictionary.put("size_dimensions", "dimensions");

                            var results = data.postings;
                            console.log("vendor search: ", results);

                            if (results.length) {

                                for (i = 0; i < factory.jsonTemplate.mentions.hashtags.length; i++) {
                                    if (factory.jsonTemplate.mentions.hashtags[i].hashtag == selectedProduct.value) {
                                        console.log("saving metadata to hashtags");
                                        factory.jsonTemplate.mentions.hashtags[i].results = results;
                                    }
                                }


                                var totalPrice = 0;
                                var catHashTable = new Hashtable();
                                var loopCounter = 0;

                                for (i = 0; i < factory.jsonTemplate.mentions.hashtags.length; i++) {

                                    console.log("HASHTAG IS: ", factory.jsonTemplate.mentions.hashtags[i].hashtag, "!!!!!!!!!!!");

                                    var results = factory.jsonTemplate.mentions.hashtags[i].results;

                                    if (results) {

                                        var numOfCategoryResults = results.length;

                                        for (j = 0; j < numOfCategoryResults; j++) {

                                            var categoryCode = results[j].category;

                                            loopCounter++

                                            //Tally how many times each category of items is returned
                                            if (catHashTable.containsKey(categoryCode)) {
                                                var count = catHashTable.get(categoryCode);
                                                var plusOne = count + 1;
                                                catHashTable.put(categoryCode, plusOne);
                                            } else {
                                                catHashTable.put(categoryCode, 1);
                                            }
                                            //Add all the prices together
                                            var price = results[j].price;
                                            if (price) {
                                                totalPrice = parseInt(totalPrice + price);
                                            }

                                        }

                                        //Calculate and save our average price
                                        factory.jsonTemplate.price_avg = parseInt(totalPrice / loopCounter);


                                        //Divide number of unique categories by number of results to calculate our popular cateogry
                                        console.log("number of unique categories: ", catHashTable.size(), "& number of total results: ", loopCounter);
                                        var avgWeight = Math.abs(loopCounter / catHashTable.size());
                                        console.log("Our avg weight for winning category is: ", avgWeight);

                                        var largest = 0;
                                        var mostPopularCategory = null;
                                        catHashTable.each(function (category) {

                                            var currentCategoryCount = Math.abs(catHashTable.get(category));

                                            console.log(category, " was found ", currentCategoryCount, "times");

                                            if (currentCategoryCount > largest) {
                                                largest = currentCategoryCount;
                                                mostPopularCategory = category;
                                            }
                                        });

                                        console.log("our most popular category is: ", mostPopularCategory);
                                        factory.jsonTemplate.category = mostPopularCategory;

                                    }

                                }


                                //Loop through annotations of each result and count the annotation if its in our annotation Dictionary its in our popular category
                                console.log("Looping though all results again");
                                var annotationsHashTable = new Hashtable();
                                var annotationCount = 0;

                                for (j = 0; j < factory.jsonTemplate.mentions.hashtags.length; j++) {

                                    console.log("ANNOTATION HASHTAG IS: ", factory.jsonTemplate.mentions.hashtags[j].hashtag, "!!!!!!!!!!!");

                                    var results = factory.jsonTemplate.mentions.hashtags[j].results;

                                    if (results) {

                                        var numOfCategoryResults = results.length;

                                        for (i = 0; i < numOfCategoryResults; i++) {
                                            var categoryCode = results[i].category;


                                            //Tally how many times each category of items is returned
                                            if (categoryCode == mostPopularCategory) {
                                                var annotationObj = results[i].annotations;
                                                if (annotationObj) {
                                                    for (var key in annotationObj) {
                                                        if (annotationsDictionary.containsKey(key)) {
                                                            annotationCount++
                                                            if (annotationsHashTable.containsKey(key)) {
                                                                var count = annotationsHashTable.get(key);
                                                                var plusOne = count + 1;
                                                                annotationsHashTable.put(key, plusOne);
                                                            } else {
                                                                annotationsHashTable.put(key, 1);
                                                            }
                                                        } else {
                                                            //                                    console.log("omitting cause", key, "is not in our dictionary");
                                                        }
                                                    }
                                                } else {
                                                    console.log("does not have annotation object", results[i]);
                                                }

                                            } else {
                                                console.log("omitting cause", categoryCode, "is not popular", mostPopularCategory);
                                            }
                                        }
                                    }
                                }


                                $http.get('../search/categories?', {
                                    params: {
                                        categoryCode: mostPopularCategory
                                    }
                                }).success(function (data, status) {

                                    factory.jsonTemplate.category_name = data.metadata.name;
                                    factory.jsonTemplate.category_group = data.metadata.group_code;
                                    factory.jsonTemplate.category_group_name = data.metadata.group_name;

                                    if(annotationsHashTable.size() > 0) {

                                        //Gather our popular annotations
                                        console.log("We have ", annotationsHashTable.size(), "unique annotations in : ", annotationCount, "results");
                                        var annotationObj = {};
                                        var avg_weight = Math.abs(annotationCount / annotationsHashTable.size());

                                        console.log("Annotations should weigh more than: ", avg_weight);

                                        var hintsString = "Use the \"&\" symbol to include the ";
                                        annotationsHashTable.each(function (key) {

                                            var weight = Math.abs(annotationsHashTable.get(key));

                                            console.log(key, " has weight of", weight);

                                            if (weight >= avg_weight) {

                                                hintsString += annotationsDictionary.get(key) + ", ";

                                                console.log(weight, ">=", avg_weight);
                                                annotationObj[key] = null;

                                            }
                                        });

                                        factory.jsonTemplate.annotations = annotationObj;

                                        hintsString = hintsString.substring(0, hintsString.length - 2);
                                        hintsString += " of the " + factory.jsonTemplate.mentions.hashtags[0].hashtag;
                                        factory.jsonTemplate.hints = hintsString;

                                    } else {

                                        factory.jsonTemplate.hints = "Looks like your listing belongs in the " + factory.jsonTemplate.category_name + " category.  Add more #'s to describe your item if this is incorrect.";

                                    }


                                    console.log("---------------------------");
                                    console.log("done weighing all hashtags!");
                                    console.log("---------------------------");

                                });

                            }
                        });


                        deferred.resolve(factory.jsonTemplate);

                        return deferred.promise;

                    };


                    //We use google maps as a service
                    factory.googleMap = new google.maps.Map(document.createElement("map-canvas"));

                    factory.predictPlace = function (term) {

                        var googlePlacesService = new google.maps.places.AutocompleteService();

                        var deferred = $q.defer();

                        //Get predictions from google
                        googlePlacesService.getPlacePredictions({ input: term }, function (predictions, status) {

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

                        googleMaps.getDetails(request, function (placeMetaData, status) {

                            if (status != google.maps.places.PlacesServiceStatus.OK) {
                                console.log(status)
                                return
                            }

                            placeMetaData.description = selectedPlace.description;

                            console.log("here is our extra meta data");
                            console.log(placeMetaData);

                            var locationObj = {};

                            if (placeMetaData.formatted_address) {
                                locationObj.formatted_address = placeMetaData.formatted_address;
                            }
                            ;


                            if (placeMetaData.geometry.location.lat()) {
                                locationObj.lat = placeMetaData.geometry.location.lat();
                                locationObj.long = placeMetaData.geometry.location.lng();
                            }
                            ;


                            if (placeMetaData.address_components) {
                                for (var i = 0; i < placeMetaData.address_components.length; ++i) {

                                    //Get State
                                    if (placeMetaData.address_components[i].types[0] == "administrative_area_level_1") {
                                        var state = placeMetaData.address_components[i].short_name;
                                        locationObj.state = state;
                                    }

                                    //Get City
                                    if (placeMetaData.address_components[i].types[0] == "locality") {
                                        var city = placeMetaData.address_components[i].long_name;
                                        locationObj.short_name = city;
                                    }

                                    //Get Country
                                    if (placeMetaData.address_components[i].types[0] == "country") {
                                        var country = placeMetaData.address_components[i].short_name;
                                        locationObj.country = country;
                                    }

                                    //Get Zipcode
                                    if (placeMetaData.address_components[i].types[0] == "postal_code") {
                                        var zipcode = placeMetaData.address_components[i].short_name;
                                        locationObj.zipcode = zipcode;
                                    }

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
                }]
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.modalContent.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
}]);


htsApp.filter('words', function () {
    return function (input, words) {
        if (isNaN(words)) {
            return input;
        }
        if (words <= 0) {
            return '';
        }
        if (input) {
            var inputWords = input.split(/\s+/);
            if (inputWords.length > words) {
                input = inputWords.slice(0, words).join(' ') + '\u2026';
            }
        }
        return input;
    };
});


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
            }
        }
    }
});


htsApp.directive('contenteditable', ['$sce', function ($sce) {
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
                if (ngModel.$viewValue !== element.html()) {
                    element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                }
            };

            // Listen for change events to enable binding
            element.on('blur keyup', function () {
                scope.$apply(read);
            });
            read(); // initialize
        }
    };
}]);
