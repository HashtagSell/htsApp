/**
 * Created by braddavis on 1/6/15.
 */
htsApp.factory('newPostFactory', ['$q', '$http', 'ENV', function ($q, $http, ENV) {

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

        this.jsonTemplate.mentions.hashtags.push({hashtag: selectedProduct.value, results: null});

        //console.log("here is our json template");
        //console.log(this.jsonTemplate);

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
                source: 'APTSD|AUTOD|BKPGE|CRAIG|EBAYM|E_BAY',
                rpp: 99,
                retvals: "price,category,annotations",
                logic: true
            }
        }).success(function (data, status) {

            //These are the only potential annotations we will ask the user for today.
            var annotationsDictionary = new Hashtable();
            annotationsDictionary.put("year","Year");
            annotationsDictionary.put("condition","Condition");
            //annotationsDictionary.put("make","Make");
            annotationsDictionary.put("title_status","Title");
            //annotationsDictionary.put("model","Model");
            annotationsDictionary.put("mileage","Mileage");
            annotationsDictionary.put("transmission","Transmission");
            annotationsDictionary.put("drive","Drive");
            annotationsDictionary.put("paint_color","Paint");
            annotationsDictionary.put("type","Type");
            annotationsDictionary.put("fuel","Fuel");
            annotationsDictionary.put("size","Size");
            annotationsDictionary.put("bathrooms","Bath");
            annotationsDictionary.put("no_smoking","Smoking");
            annotationsDictionary.put("bedrooms","Rooms");
            annotationsDictionary.put("dogs","Dogs");
            annotationsDictionary.put("cats","Cats");
            annotationsDictionary.put("attached_garage","Garage");
            annotationsDictionary.put("laundry_on_site","Laundry");
            annotationsDictionary.put("sqft","Sq Ft");
            annotationsDictionary.put("size_dimensions","Dimensions");

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
                var mostPopularCategory = null;

                var rankCategory = function (category) {

                    var currentCategoryCount = Math.abs(catHashTable.get(category));

                    console.log(category, " was found ", currentCategoryCount, "times");

                    if (currentCategoryCount > largest) {
                        largest = currentCategoryCount;
                        mostPopularCategory = category;
                    }
                };

                for (i = 0; i < factory.jsonTemplate.mentions.hashtags.length; i++) {

                    console.log("HASHTAG IS: ", factory.jsonTemplate.mentions.hashtags[i].hashtag, "!!!!!!!!!!!");

                    results = factory.jsonTemplate.mentions.hashtags[i].results;

                    if (results) {

                        var numOfCategoryResults = results.length;

                        for (j = 0; j < numOfCategoryResults; j++) {

                            var categoryCode = results[j].category;

                            loopCounter++;

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

                        catHashTable.each(rankCategory);

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


                    var presentationMode = false;
                    if(factory.jsonTemplate.mentions.hashtags[j].hashtag === "macbook air"){
                        console.log('presentation mode!');

                        presentationMode = true;
                    }

                    results = factory.jsonTemplate.mentions.hashtags[j].results;

                    if (results) {

                        var numOfCategoryResultsAgain = results.length;

                        for (i = 0; i < numOfCategoryResultsAgain; i++) {
                            var categoryCodeAgain = results[i].category;


                            //Tally how many times each category of items is returned
                            if (categoryCodeAgain == mostPopularCategory) {
                                var annotationObj = results[i].annotations;
                                if (annotationObj) {
                                    for (var key in annotationObj) {
                                        if (annotationsDictionary.containsKey(key)) {
                                            annotationCount++;
                                            if (annotationsHashTable.containsKey(key)) {
                                                var countAgain = annotationsHashTable.get(key);
                                                var plusOneAgain = countAgain + 1;
                                                annotationsHashTable.put(key, plusOneAgain);
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
                                console.log("omitting cause", categoryCodeAgain, "is not popular", mostPopularCategory);
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

                    if (annotationsHashTable.size() > 0) {

                        //Gather our popular annotations
                        console.log("We have ", annotationsHashTable.size(), "unique annotations in : ", annotationCount, "results");
                        var annotationArray = [];
                        var avg_weight = Math.abs(annotationCount / annotationsHashTable.size());

                        console.log("Annotations should weigh more than: ", avg_weight);

                        //var hintsString = "Use the \"&\" symbol to include the ";
                        annotationsHashTable.each(function (key) {

                            var weight = Math.abs(annotationsHashTable.get(key));

                            console.log(key, " has weight of", weight);

                            if (weight >= avg_weight) {

                                annotationArray.push({key: annotationsDictionary.get(key), value: null});

                                //hintsString += annotationsDictionary.get(key) + ", ";

                                console.log(weight, ">=", avg_weight);
                                //annotationObj[key] = null;

                            }
                        });


                        //TODO: Presentation only.  Please remove after SVNT.
                        //if(presentationMode){
                        //    annotationArray = annotationArray.concat([
                        //        {key: 'Hard Drive (Gb)', value: null},
                        //        {key: 'Memory (Gb)', value: null},
                        //        {key: 'Screen (inches)', value: null},
                        //        {key: 'Warranty', value: null}
                        //    ]);
                        //}


                        factory.jsonTemplate.annotations = annotationArray;

                        //hintsString = hintsString.substring(0, hintsString.length - 2);
                        //hintsString += " of the " + factory.jsonTemplate.mentions.hashtags[0].hashtag;
                        //factory.jsonTemplate.hints = hintsString;

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