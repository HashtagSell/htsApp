var HashTable = require('hashtable');

exports.dedupe = function(result, promise){

    var response = result.external;

    var deDupeExternalID = new HashTable();

    var deDupeHeading = new HashTable();

    var duplicates = [];

    var originals = [];

    deDupeExternalID.put(response.postings[0].external_url, 0);
    //console.log("ID is unique: " + response.postings[0].external_id);
    deDupeHeading.put(response.postings[0].heading, 0);
    //console.log("Heading is unique: " + response.postings[0].heading);

    for (var i = 1; i < response.postings.length; i++) {

        result = response.postings[i];

        if(typeof deDupeExternalID.get(result.external_url) === 'undefined'){
            //console.log("URL is unique: " + result.external_url);
            deDupeExternalID.put(result.external_url, i);

            if(typeof deDupeHeading.get(result.heading) === 'undefined'){
                //console.log("Heading is unique: "+ result.heading);
                deDupeHeading.put(result.heading, i);

//                TODO: Clean up HTML
//                htmlDecoder(result);
                originals.push(result);

            } else {

                duplicates.push(result);
                console.log("Duplicate Heading: "+ result.heading);
            }
        } else {
            duplicates.push(result);
            console.log("Duplicate URL: "+result.external_url);
        }

//        console.log("------------------------------------------------------")

    }


    console.log("!!!!!!!!!~~~~ DONE WITH DEDUPE ~~~~!!!!!!!!!");
    console.log(duplicates.length + " Duplicates");
    console.log(originals.length + " Originals");
    console.log("!!!!!!!!!~~~~ DONE WITH DEDUPE ~~~~!!!!!!!!!");

    promise(null, originals);

};