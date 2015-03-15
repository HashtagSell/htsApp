var util = require('util'),
    OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
    awsId:     'AKIAJASAHA4PWYDT5SBQ',
    awsSecret: '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',
    assocId:   'hasht09-20'
    //xml2jsOptions: an extra, optional, parameter for if you want to pass additional options for the xml2js module. (see https://github.com/Leonidas-from-XIV/node-xml2js#options)
});


// execute(operation, params, callback)
// operation: select from http://docs.aws.amazon.com/AWSECommerceService/latest/DG/SummaryofA2SOperations.html
// params: parameters for operation (optional)
// callback(err, parsed, raw): callback function handling results. err = potential errors raised from xml2js.parseString() or http.request(). parsed = xml2js parsed response. raw = raw xml response.


//TODO: Get the product details section of the amazon page (annotations)
opHelper.execute('ItemSearch', {
    'SearchIndex': 'Electronics', //POSSIBLE OPTIONS ARE:  \'Software\',\'MP3Downloads\',\'OutdoorLiving\',\'FashionWomen\',\'Luggage\',\'All\',\'VideoGames\',\'Jewelry\',\'KindleStore\',\'Kitchen\',\'WirelessAccessories\',\'HealthPersonalCare\',\'OfficeProducts\',\'MusicalInstruments\',\'FashionGirls\',\'Blended\',\'Music\',\'Marketplace\',\'Automotive\',\'Industrial\',\'FashionBoys\',\'ArtsAndCrafts\',\'Photo\',\'Tools\',\'UnboxVideo\',\'FashionBaby\',\'FashionMen\',\'Books\',\'Appliances\',\'MobileApps\',\'DigitalMusic\',\'Electronics\',\'Video\',\'LawnAndGarden\',\'MusicTracks\',\'HomeGarden\',\'Apparel\',,\'Wireless\',\'Classical\',\'VHS\',\'Collectibles\',\'Magazines\',\'Miscellaneous\',\'Baby\',\'GiftCards\',\'GourmetFood\',\'Beauty\',\'SportingGoods\',\'DVD\',\'Grocery\',\'PCHardware\',\'Watches\',\'Fashion\',\'Shoes\',\'Toys\',\'PetSupplies\
    'ResponseGroup': 'Large', //POSSIBLE RESPONSE GROUP OPTIONS:  http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CHAP_ResponseGroupsList.html
    'Keywords': 'Macbook Air' //I'm selling my #Macbook Air
}, function(err, json, rawXML) { // you can add a third parameter for the raw xml response, "results" here are currently parsed using xml2js

    //Print out results.
    console.log(util.inspect(json, false, null));

    //Get all items in result
    //var items = json.ItemSearchResponse.Items[0].Item;
    //
    ////Loop through each item in result and get more details about each item.  This not working.
    //for (var i=0; i < items.length; i++){
    //    opHelper.execute('ItemLookup', {
    //        'ItemId': items[i].ASIN[0],
    //        'ResponseGroup': 'Large'
    //    }, function(err, results) {
    //        console.log(util.inspect(results, false, null));
    //    });
    //}
});