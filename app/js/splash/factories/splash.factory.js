/**
 * Created by braddavis on 11/15/14.
 */
htsApp.factory('splashFactory', function () {

    var annotationsDictionary = new Hashtable();

    //CL annotations
    annotationsDictionary.put("source_neighborhood","Neighborhood");
    annotationsDictionary.put("year","Year");
    annotationsDictionary.put("make","Make");
    annotationsDictionary.put("title_status","Title");
    annotationsDictionary.put("model","Model");
    annotationsDictionary.put("mileage","Mileage");
    annotationsDictionary.put("transmission","Transmission");
    annotationsDictionary.put("drive","Drive");
    annotationsDictionary.put("paint_color","Paint");
    annotationsDictionary.put("phone","Phone");
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

    //ebay annotations
    annotationsDictionary.put("listingtype","Listing Type");

    var factory = {};

    factory.sanitizeAnnotations = function (annoationsObj) {

        var sanitizedAnnotationsObj = {};

        angular.forEach(annoationsObj, function(value, key) {
            console.log(key + ': ' + value);

            var validatedKey = annotationsDictionary.get(key);

            if (validatedKey) {
                sanitizedAnnotationsObj[validatedKey] = value;
            }


        });

        return sanitizedAnnotationsObj;
    };

    return factory;
});