var env = require('./../env.json');

exports.config = function() {
    var node_env = process.env.NODE_ENV || 'DEVELOPMENT';
    return env[node_env];
};