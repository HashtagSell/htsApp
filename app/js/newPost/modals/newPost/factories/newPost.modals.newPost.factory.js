/**
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
                //console.log("nothing found");
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
                    //var mostPopularCategory = popularCategories[0].code;





                    var winningCategories = [];
                    var total = 0;

                    for (var i = 0; i < popularCategories.length; i++) {

                        var firstCategory = data[i];

                        total = total + firstCategory.count;

                    }

                    var avg = (total / popularCategories.length);

                    console.log('total: ', total, ' divided by number of categories: ', popularCategories.length, ' equals: ', avg);

                    for (var j = 0; j < popularCategories.length; j++) {

                        var secondCategory = popularCategories[j];

                        console.log('total number of items: ', total);
                        console.log('number of items in category: ', secondCategory.code, ' is: ', secondCategory.count);
                        var percentage = (secondCategory.count/total) * 100;
                        console.log('Percentage weight for category: ', secondCategory.code, ' is: ', percentage);


                        if (percentage >= 10) {
                            winningCategories.push(secondCategory.code);
                        }

                    }

                    if (winningCategories.length > 1) {
                        factory.jsonTemplate.category = winningCategories;
                    } else if (winningCategories.length === 1) {
                        factory.jsonTemplate.category = [winningCategories[0], ''];
                    } else if (!winningCategories.length && popularCategories.length){
                        factory.jsonTemplate.category = [popularCategories.categories[0].code, ''];
                    }



                    $http.get(ENV.groupingsAPI + winningCategories[0]).success(function (data, status) {

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

                                //Caculate average price of all data we retreived.
                                if (totalPrice > 0) {
                                    factory.jsonTemplate.price_avg = totalPrice / priceCount;
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
                                        title: "We need more info",
                                        message: "We could not determine what further questions to ask about your " + queryString + ".  Please add more hashtags to your description."
                                    });
                                }


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
}]);