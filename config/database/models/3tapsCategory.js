// load the things we need
var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
        code        : String,
        group_code  : String,
        group_name  : String,
        name        : String
});


// create the model for users and expose it to our app
module.exports = mongoose.model('product_categories', categorySchema);