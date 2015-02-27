// load the things we need
var mongoose = require('mongoose');

var newPostSchema = mongoose.Schema({
    "annotations": [],
    "body": {type: String, default: null},
    "coordinates": {type: [Number], index: '2dsphere'},
    "category": {type: String, default: null},
    "category_name": {type: String, default: null},
    "category_group": {type: String, default: null},
    "category_group_name": {type: String, default: null},
    "distanceFromUser": {type: Number, default: null},
    "heading": {type: String, default: null},
    "html_body": {type: String, default: null},
    "images": [],
    "location": {
        "formatted_address": {type: String, default: null},
        "lat": {type: Number, default: null},
        "long": {type: Number, default: null},
        "short_name": {type: String, default: null},
        "state": {type: String, default: null},
        "country": {type: String, default: null},
        "zipcode": {type: Number, default: null},
        "accuracy": {type: Number, default: null},
        "bounds_max_lat": {type: Number, default: null},
        "bounds_max_long": {type: Number, default: null},
        "bounds_min_lat": {type: Number, default: null},
        "bounds_min_long": {type: Number, default: null},
        "city": {type: String, default: null},
        "long_name": {type: String, default: null}
    },
    "mentions": {
        "hashtags": {type: String, default: null, index: "text"},
        "atTags": [String],
        "priceTag": [Number]
    },
    "price": {type: Number, default: 0},
    "price_avg": {type: Number, default: null},
    "price_type": {type: String, default: null},
    "seller_id": {type: String, default: null},
    "seller_username": {type: String, default: null},
    "source": {type: String, default: "HSHTG"}
});


//newPostSchema.virtual("external_id").get(function () {
//    return this._id;
//});


// create the model for new posts and expose it to our app
module.exports = mongoose.model('hts_posts', newPostSchema);