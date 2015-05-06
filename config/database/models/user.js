// app/models/user.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        role         : String
    },
    user_settings    : {
        name         : String,
        biography    : { type: String, default: "Add a profile description" },
        location_type: { type: String, default: "Approximate" },
        linkedAccounts: {
            facebook         : {
                id           : String,
                token        : String,
                tokenExpiration: Date,
                email        : String,
                name         : String
            },
            twitter          : {
                id           : String,
                token        : String,
                tokenSecret  : String,
                tokenExpiration: Date,
                displayName  : String,
                username     : String
            },
            ebay             : {
                timestamp    : Date,
                version      : String,
                build        : String,
                eBayAuthToken: String,
                hardExpirationTime: Date
            },
            amazon           : {
                id           : String,
                token        : String,
                email        : String,
                name         : String
            }
        },
        safe_search  : { type: Boolean, default: true },
        email_provider : {
            type: Array,
            default: [
                {
                    name : "Always Ask",
                    value: "ask"
                }
            ]
        },
        profile_photo : { type: String, default: "//static.hashtagsell.com/htsApp/placeholders/user-placeholder.png" },
        banner_photo : { type: String, default: "//static.hashtagsell.com/htsApp/placeholders/header-placeholder.png" },
        user_labels  : [],
        favorites    : [],
        feed_categories : {
            type: Array,
            default: [
                {
                    "name" : "Real Estate",
                    "code" : "RRRR"
                },
                {
                    "name" : "For Sale",
                    "code" : "SSSS"
                },
                {
                    "name" : "Vehicles",
                    "code" : "VVVV"
                }
            ]
        }
    },
    stats            : {
        activated    : { type: Boolean, default: false },
        activation_code: { type: String, default: randomString() },
        creation_date: { type: Date, default: Date.now },
        login_count  : { type: Number, default: 0 }
    }

});


function randomString() {
    var chars =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var randomstring = '';
    var string_length = 30;
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);