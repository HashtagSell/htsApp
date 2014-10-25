var HashTable = require('hashtable');

exports.dedupe = function(result, promise){

    var response = result.external;

    var deDupeExternalID = new HashTable();

    var deDupeHeading = new HashTable();

    var duplicates = [];

    var originals = [];

    for (var i = 0; i < response.postings.length; i++) {

        result = response.postings[i];

        /* console.log(result); */

        if(!deDupeExternalID.get(result.external_id)){
//            console.log("ID is unique: " + result.external_id);
            deDupeExternalID.put(result.external_id, i);

            if(!deDupeHeading.get(result.heading)){
//                console.log("Heading is unique: "+ result.heading);
                deDupeHeading.put(result.heading, i);

//                TODO: Clean up HTML
//                htmlDecoder(result);
                originals.push(result);

            } else {

                duplicates.push(result);
//                console.log("Duplicate Heading: "+ result.heading);
            }
        } else {
            duplicates.push(result);
//            console.log("Duplicate ID: "+result.external_id);
        }

//        console.log("------------------------------------------------------")

    }


    console.log("!!!!!!!!!~~~~ DONE WITH DEDUPE ~~~~!!!!!!!!!");
    console.log(duplicates.length + " Duplicates");
    console.log(originals.length + " Originals");
    console.log("!!!!!!!!!~~~~ DONE WITH DEDUPE ~~~~!!!!!!!!!");

    promise(null, originals);

//    request(concatURL, promise, function (error, response, body) {
//        if (!error && response.statusCode == 200) {
//
//            var results = JSON.parse(body);
//
//            promise(null, results);
//
//        } else if (error) {
//
//            console.log(error);
//
//            promise(error, null);
//
//        }
//    });

};