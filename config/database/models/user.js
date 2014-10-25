// app/models/user.js
// load the things we need
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
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    user_settings    : {
        name         : String,
        rpp          : { type: Number, default: 15 },
        safe_search  : { type: Boolean, default: true },
        email_provider : { type: String, default: "ask" },
        user_labels  : [],
        favorites    : []
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