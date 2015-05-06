/**
 * Created by braddavis on 5/5/15.
 */

// load the things we need
var mongoose = require('mongoose');

var feedbackSchema = mongoose.Schema({
    user        : String,
    generalFeedback  : String
});


// create the model for users and expose it to our app
module.exports = mongoose.model('feedback', feedbackSchema);