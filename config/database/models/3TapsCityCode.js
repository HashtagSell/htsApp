// load the things we need
var mongoose = require('mongoose');

var cityCodeSchema = mongoose.Schema({
        bounds_max_lat : Number,
        bounds_max_long: Number,
        bounds_min_lat : Number,
        bounds_min_long: Number,
        code           : String,
        full_name      : String,
        short_name     : String
});


// create the model for users and expose it to our app
module.exports = mongoose.model('city_codes', cityCodeSchema);