// load the things we need
var mongoose = require('mongoose');

var analyticsSchema = mongoose.Schema({
    timestamp    : { type: Date, default: Date.now },
    email        : String,
    heading      : String,
    source       : String,
    rpp          : String,
    lat          : String,
    lon          : String,
    category     : [],
    sort         : String,
    retvals      : String,
    anchor       : Number,
    next_tier    : Number,
    max_dist     : Number,
    next_page    : Number
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Analytics', analyticsSchema);