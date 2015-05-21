//var HashTable = require('hashtable');

exports.dedupe = function(result, promise){

    var userLat = result.location.latitude;

    var userLong = result.location.longitude;

    var response = result.external;

    //var deDupeExternalID = new HashTable();
    //
    //var deDupeHeading = new HashTable();

    //var duplicates = [];

    var originals = [];

    //deDupeExternalID.put(response.postings[0].external_url, 0);
    ////console.log("ID is unique: " + response.postings[0].external_id);
    //deDupeHeading.put(response.postings[0].heading, 0);
    ////console.log("Heading is unique: " + response.postings[0].heading);

    for (var i = 1; i < response.postings.length; i++) {

        result = response.postings[i];

        //if(typeof deDupeExternalID.get(result.external_url) === 'undefined'){
        //    //console.log("URL is unique: " + result.external_url);
        //    deDupeExternalID.put(result.external_url, i);
        //
        //    if(typeof deDupeHeading.get(result.heading) === 'undefined'){
        //        //console.log("Heading is unique: "+ result.heading);
        //        deDupeHeading.put(result.heading, i);

//              TODO: Clean up HTML
                originals.push(convertToHTSObjStructure(result, userLat, userLong));

        //    } else {
        //
        //        duplicates.push(result);
        //        console.log("Duplicate Heading: "+ result.heading);
        //    }
        //} else {
        //    duplicates.push(result);
        //    console.log("Duplicate URL: "+result.external_url);
        //}
    }


    //console.log("!!!!!!!!!~~~~ DONE WITH DEDUPE ~~~~!!!!!!!!!");
    //console.log(duplicates.length + " Duplicates");
    //console.log(originals.length + " Originals");
    //console.log("!!!!!!!!!~~~~ DONE WITH DEDUPE ~~~~!!!!!!!!!");

    promise(null, originals);

};


function convertToHTSObjStructure(orgObj, userLat, userLong) {

    var reformattedObj = {
        "_id": orgObj.external_id,
        "categoryCode": orgObj.category,
        "username": orgObj.source,
        "heading": orgObj.heading,
        "body": orgObj.body,
        "expiresAt": null,
        "annotations": orgObj.annotations,
        "postingId": orgObj.external_id,
        "language": "EN",
        "images": orgObj.images,
        "geo": {
            "accuracy": orgObj.location.accuracy,
            "status" : orgObj.location.geolocation_status,
            "coordinates": [
                orgObj.location.long,
                orgObj.location.lat
            ],
            distance: getDistanceFromLatLonInMeters(userLat, userLong, orgObj.location.lat, orgObj.location.long)
        },
        "createdAt": orgObj.timestamp,
        "askingPrice": {
            "value": orgObj.price,
            "currency": "USD"
        },
        "external": {
            "threeTaps": {
                "timestamp": orgObj.timestamp,
                "status" : 'for_sale',
                "location": {
                    "state": orgObj.location.state,
                    "formatted": orgObj.location.formatted_address,
                    "country": orgObj.location.country,
                    "city": orgObj.location.city
                },
                "categoryGroup": orgObj.category_group,
                "category": orgObj.category
            },
            "source": {
                "code": orgObj.source,
                "url": orgObj.external_url,
                "id": orgObj.external_id
            }
        }
    };

    return reformattedObj;
}



function getDistanceFromLatLonInMeters(lat1,lon1,lat2,lon2) {
    var R = 6378100; // Radius of the earth in meters
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}


function deg2rad(deg) {
    return deg * (Math.PI/180);
}