// load the things we need
var mongoose = require('mongoose');

var EarlyAccessKeySchema = mongoose.Schema({

    secret    : {
        key   : String,
        expired  : Boolean,
        generated_by : String,
        used_by : [],
        type_of_key : String
    }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Early_Access_Keys', EarlyAccessKeySchema);