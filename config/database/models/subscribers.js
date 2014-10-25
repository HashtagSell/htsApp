// load the things we need
var mongoose = require('mongoose');

var SubscribersSchema = mongoose.Schema({

    user    : {
        email   : String,
        name  : String
    }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Subscribers', SubscribersSchema);