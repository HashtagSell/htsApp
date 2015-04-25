/**
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
}]);