var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var emergencySchema = new mongoose.Schema({
    name: String,
    phone: String,
    location: String,
    dob: String,
    sex: String,
    diseaseHistory: String,
}, {
    versionKey: false
});

module.exports = mongoose.model('Details', emergencySchema);