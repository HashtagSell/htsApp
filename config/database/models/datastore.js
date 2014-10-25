// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var dataStoreSchema = mongoose.Schema({

//    result            : {type:Object}

    result            : {
        "query" : String,
        "anchor" : { type: Number},
        "next_page" : { type: Number}
    }

});

// create the model for datastore and expose it to our app
module.exports = mongoose.model('dataStore', dataStoreSchema);