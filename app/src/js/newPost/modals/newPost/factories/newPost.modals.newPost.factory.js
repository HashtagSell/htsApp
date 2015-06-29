/**
 * Created by braddavis on 1/6/15.
 */
htsApp.factory('newPostFactory', ['$q', '$http', '$timeout', '$filter', 'ENV', 'utilsFactory', 'Notification', function ($q, $http, $timeout, $filter, ENV, utilsFactory, Notification) {

    var factory = {}; //init the factory

    var tempDiv = document.createElement("DIV"); //Used for stripping html from strings

    factory.alerts = {
        banners: []
    };

    factory.defaultJson = {
        "annotations": [],
        "category": null,
        "category_name": null,
        "category_group": null,
        "category_group_name": null,
        "body": null,
        "images": [],
        "location": {},
        "hashtags": [],
        "price": null,
        "price_avg": null,
        "price_type": null,
        "source": "HSHTG",
    };


    factory.setJsonTemplate = function () {
        factory.jsonTemplate = angular.copy(factory.defaultJson);
        return factory.jsonTemplate;
    };



    factory.annotationsDictionary = new Hashtable();
    factory.annotationsDictionary.put("year", "Year");
    factory.annotationsDictionary.put("condition", "Condition");
    factory.annotationsDictionary.put("make", "Make");
    factory.annotationsDictionary.put("title_status", "Title");
    factory.annotationsDictionary.put("model", "Model");
    factory.annotationsDictionary.put("mileage", "Mileage");
    factory.annotationsDictionary.put("transmission", "Transmission");
    factory.annotationsDictionary.put("drive", "Drive");
    factory.annotationsDictionary.put("paint_color", "Paint");
    factory.annotationsDictionary.put("type", "Type");
    factory.annotationsDictionary.put("fuel", "Fuel");
    factory.annotationsDictionary.put("size", "Size");
    factory.annotationsDictionary.put("bathrooms", "Bath");
    factory.annotationsDictionary.put("no_smoking", "Smoking");
    factory.annotationsDictionary.put("bedrooms", "Rooms");
    factory.annotationsDictionary.put("dogs", "Dogs");
    factory.annotationsDictionary.put("cats", "Cats");
    factory.annotationsDictionary.put("attached_garage", "Garage");
    factory.annotationsDictionary.put("laundry_on_site", "Laundry");
    factory.annotationsDictionary.put("sqft", "Sq Ft");
    factory.annotationsDictionary.put("size_dimensions", "Dimensions");

    //ebay motors annotations
    factory.annotationsDictionary.put("body_type", "Body Type");
    factory.annotationsDictionary.put("drive_type", "Drive Type");
    factory.annotationsDictionary.put("engine", "Engine");
    factory.annotationsDictionary.put("exterior_color", "Exterior Color");
    factory.annotationsDictionary.put("for_sale_by", "Seller Type");
    factory.annotationsDictionary.put("interior_color", "Interior Color");
    factory.annotationsDictionary.put("fuel_type", "Fuel Type");
    factory.annotationsDictionary.put("listing_type", "Listing Type");
    factory.annotationsDictionary.put("number_of_cylinders", "Cylinders");
    factory.annotationsDictionary.put("options", "Options");
    factory.annotationsDictionary.put("power_options", "Power Options");
    factory.annotationsDictionary.put("safety_features", "Safety");
    factory.annotationsDictionary.put("ship_to_location", "Ship To");
    factory.annotationsDictionary.put("trim", "Trim");
    factory.annotationsDictionary.put("vehicle_title", "Title");
    factory.annotationsDictionary.put("vin", "Vin");
    factory.annotationsDictionary.put("warranty", "Warranty");

    //autotrader annotations
    factory.annotationsDictionary.put("bodyStyle", "Body Type");
    factory.annotationsDictionary.put("drivetrain", "Drive Train");
    factory.annotationsDictionary.put("exteriorColor", "Exterior Color");
    factory.annotationsDictionary.put("interiorColor", "Interior Color");


    //amazon annotations
    factory.annotationsDictionary.put("Color", "Color");
    factory.annotationsDictionary.put("Brand", "Brand");
    factory.annotationsDictionary.put("Material Type", "Material Type");
    factory.annotationsDictionary.put("Model", "Model");
    //factory.annotationsDictionary.put("Part Number", "Part Number");
    factory.annotationsDictionary.put("Warranty", "Warranty");
    factory.annotationsDictionary.put("CPU Speed", "Processor Speed");
    factory.annotationsDictionary.put("CPU Type", "Processor Type");
    factory.annotationsDictionary.put("Display Size", "Screen Size");
    factory.annotationsDictionary.put("Operating System", "OS Version");
    //factory.annotationsDictionary.put("Size", "Storage Capacity");
    factory.annotationsDictionary.put("System Memory Size", "Memory");
    factory.annotationsDictionary.put("Department", "Department");


    factory.manualCategorySelect = {
        code: null,
        show: false,
        tooltip: "message",
        init: function () {
            this.code = factory.jsonTemplate.category;
            factory.getProductMetaData();
        }
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

                    tempDiv.innerHTML = val[0];
                    var strippedHtml = tempDiv.textContent || tempDiv.innerText || "";

                    products.push({"value": strippedHtml});
                });

                if (products[0].value !== userTypedText.value) {
                    products.splice(0, 0, userTypedText);
                }

                if (products.length > 7) {
                    products.length = 7; // prune suggestions list to only 6 items because we add the usersTyped word to top of list
                }

            } else {
                //console.log("nothing found");
                products.push(userTypedText);
            }

            deferred.resolve(products);
        });

        return deferred.promise;
    };




    factory.getProductMetaData = function (selectedProduct) {

        var deferred = $q.defer();


        if(selectedProduct) {
            if(_.indexOf(this.jsonTemplate.hashtags, selectedProduct.value) === -1) {
                this.jsonTemplate.hashtags.push(selectedProduct.value);
            } else {
                return false;
            }
        }

        if(this.jsonTemplate.hashtags.length) {

            var queryString = this.jsonTemplate.hashtags.join(" ");

            factory.getPopularCategory(queryString).then(function(popularCategoryCode){

                factory.jsonTemplate.category = popularCategoryCode;

                factory.getCategoryMetadata(popularCategoryCode).then(function(data){

                    factory.manualCategorySelect.code = null;
                    factory.manualCategorySelect.show = false;

                    factory.jsonTemplate.category_name = data.categories[0].name;
                    factory.jsonTemplate.category_group = data.code;
                    factory.jsonTemplate.category_group_name = data.name;

                    factory.getInternalAnnotations(queryString).then(function(annotationArray){

                        factory.getAmazonAnnotations(queryString, annotationArray).then(function (annotationArray) {

                            if(annotationArray.length) {

                                factory.jsonTemplate.annotations = annotationArray;

                            }
                            //else {
                            //
                            //    Notification.primary({
                            //        title: "Hrmmmmm",
                            //        message: "We didn't recognize that hashtag.  Add more hashtags to help us out."
                            //    });
                            //
                            //}

                            deferred.resolve(factory.jsonTemplate);

                        }, function (err) { //failed to lookup Amazon annotations

                            //Notification.error({
                            //    title: "Ooops",
                            //    message: "Couldn't fetch Amazon data.  We're working on this."
                            //});

                            factory.alerts.banners.push({
                                type: 'danger',
                                msg: "Couldn't fetch Amazon data.  We're working on this.  Please continue with your post."
                            });

                            deferred.reject(err);

                        });

                    }, function (err) {  //failed to lookup internal annotations

                        //Notification.error({
                        //    title: "Ooops",
                        //    message: "Couldn't lookup internal production annotations.  We're working on this."
                        //});

                        factory.alerts.banners.push({
                            type: 'danger',
                            msg: "Couldn't lookup internal production annotations.  We're working on this.  Please continue with your post."
                        });

                    });

                }, function (err) { //failed to lookup category metadata

                    //Notification.error({
                    //    title: "Cannot lookup category metadata",
                    //    message: err.message
                    //});

                    factory.alerts.banners.push({
                        type: 'danger',
                        msg: "We appear to be having issues with out categories API.  Please try again later."
                    });

                });

            }, function () { //Could not determine popular category

                factory.manualCategorySelect.tooltip = "Add more hashtags to your post, or manually select the category";
                factory.manualCategorySelect.show = true;

                factory.jsonTemplate.category = "ZOTH";

                $timeout(function () {
                    $(".category-select").triggerHandler('show');

                    $timeout(function () {
                        $(".category-select").triggerHandler('hide');
                    }, 4000);

                }, 50);

                deferred.reject();

            });

        } else { //User must have deleted hashtag from post while editing.
            factory.manualCategorySelect.show = false;
            this.jsonTemplate.annotations = [];
            this.jsonTemplate.category = null;
            this.jsonTemplate.category_name = null;
            this.jsonTemplate.category_group = null;
            this.jsonTemplate.category_group_name = null;

            deferred.resolve(factory.jsonTemplate);
        }

        return deferred.promise;

    };





    factory.getPopularCategory = function (queryString) {

        var deferred = $q.defer();

        if(!factory.manualCategorySelect.code) {

            $http.get(ENV.groupingsAPI + 'popular', {
                params: {
                    query: queryString
                }
            }).success(function (data, status) {

                var popularCategories = data;

                if (popularCategories.length) {

                    deferred.resolve(popularCategories[0].code);

                } else {

                    deferred.reject();

                }

            });

        } else {

            deferred.resolve(factory.manualCategorySelect.code);

        }

        return deferred.promise;

    };



    factory.getCategoryMetadata = function (popularCategory) {

        var deferred = $q.defer();

        $http.get(ENV.groupingsAPI + popularCategory).success(function (data, status) {

            deferred.resolve(data);

        }).error(function(err){

            deferred.reject(err);

        });

        return deferred.promise;
    };



    factory.getInternalAnnotations = function (queryString) {

        var deferred = $q.defer();

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
                        categoryCode: [factory.jsonTemplate.category, '']
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

            var annotationArray = [];

            if (data.results.length) {

                for (var i = 0; i < data.results.length; i++) {

                    var posting = data.results[i];

                    if (posting.annotations) {

                        var annotationObj = posting.annotations;

                        //console.log(i, annotationObj);
                        for (var key in annotationObj) {
                            if (factory.annotationsDictionary.containsKey(key)) {
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

                //Caculate average price of all data we retreived.
                if (totalPrice > 0) {
                    factory.jsonTemplate.price_avg = totalPrice / priceCount;
                }

                if (annotationsHashTable.size() > 0) {

                    //Gather our popular annotations
                    console.log("We have ", annotationsHashTable.size(), "unique annotations in : ", annotationCount, "results");
                    var avg_weight = Math.abs(annotationCount / annotationsHashTable.size());

                    console.log("Annotations should weigh more than: ", avg_weight);

                    annotationsHashTable.each(function (key) {

                        var weight = Math.abs(annotationsHashTable.get(key));

                        console.log(key, " has weight of", weight);

                        if (weight >= avg_weight) {

                            annotationArray.push({key: factory.annotationsDictionary.get(key), value: null});

                            console.log(weight, ">=", avg_weight);
                        }
                    });

                    deferred.resolve(annotationArray);

                } else {


                    deferred.resolve(annotationArray);
                }


            } else {

                deferred.resolve(annotationArray);
            }
        });


        return deferred.promise;
    };


    factory.getAmazonAnnotations = function (queryString, annotationArray) {
        var deferred = $q.defer();

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

                    if (factory.annotationsDictionary.containsKey(key)) {

                        annotationArray.push({
                            key: factory.annotationsDictionary.get(key),
                            value: null
                        });

                    }
                }

                console.log("---------------------------");
                console.log("done adding Amazon annotations!");
                console.log("---------------------------");

                deferred.resolve(annotationArray);

            }

        }).error(function (data) {

            deferred.reject();

        });

        return deferred.promise;
    };









    factory.cleanModel = function (type, valueToRemove) {

        if(type === "#") {

            console.log('HASHTAG TO REMOVE: ', valueToRemove);

            if(valueToRemove) {
                this.jsonTemplate.hashtags = _.without(this.jsonTemplate.hashtags, valueToRemove);

                factory.getProductMetaData();
            } else {
                console.log('hashtag to remove is empty.. not cleaning model');
            }

        } else if (type === "$") {

            console.log('PRICE TO REMOVE: ', valueToRemove);

            if(valueToRemove) {
                this.jsonTemplate.price = null;
                this.jsonTemplate.price_avg = null;
                this.jsonTemplate.price_type = null;
            } else {
                console.log('price is empty, not cleaning model');
            }

        } else if (type === "@") {

            console.log('LOCATION TO REMOVE: ', valueToRemove);

            if(valueToRemove) {
                this.jsonTemplate.location = {};
            } else {
                console.log('location to remove is empty, not cleaning model');
            }

        }

        console.log(this.jsonTemplate);
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

        //if(!factory.jsonTemplate.location) {

            googleMaps.getDetails(request, function (placeMetaData, status) {

                if (status !== google.maps.places.PlacesServiceStatus.OK) {
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
                    if (!geo.location.postalCode) {

                        $http.get('/search/reversegeocode', {
                            params: {
                                lat: placeMetaData.geometry.location.lat(),
                                long: placeMetaData.geometry.location.lng()
                            }
                        }).success(function (data, status) {

                            console.log(data);

                            for (j = 0; j < data.results[0].address_components.length; j++) {

                                var adComponent = data.results[0].address_components[j];

                                if (adComponent.types[0] === "postal_code") {
                                    geo.location.postalCode = adComponent.long_name;
                                    break;
                                }
                            }

                        });
                    }

                }

                factory.jsonTemplate.location = locationObj;

                factory.jsonTemplate.geo = geo;

                deferred.resolve(factory.jsonTemplate);
            });

        //} else {
        //    return false;
        //}

        return deferred.promise;
    };








    factory.predictPrice = function (term) {

        var priceSuggestionArray = [];

        var formattedPrice = $filter('currency')(term, '$', 0);

        priceSuggestionArray.push({suggestion: formattedPrice, rate: "flat_rate", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/hr", rate: "hourly", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/day", rate: "daily", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/week", rate: "weekly", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/month", rate: "monthly", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/year", rate: "yearly", value: term});
        priceSuggestionArray.push({suggestion: formattedPrice + "/each", rate: "yearly", value: term});

        return priceSuggestionArray;
    };





    factory.getPriceMetaData = function (selectedPrice) {

        console.log('here is what we have in price meta data', this.jsonTemplate.price);

        if(this.jsonTemplate.price === null) {

            this.jsonTemplate.price = selectedPrice.value;
            this.jsonTemplate.price_type = selectedPrice.rate;

            return true;
        } else {
            return false;
        }
    };


    return factory;
}]);