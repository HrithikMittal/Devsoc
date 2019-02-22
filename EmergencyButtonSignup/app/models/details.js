var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetailSchema = new Schema({
  PatientName: String,
  PatientAddress: String,
  PatientNo: Number,
  PatientDisease: String,
  PatientDoctor: String,
  PatientPassword: String,
  PatientSex = String,
  PatientDob = String,
});

module.exports = mongoose.model('Details', DetailSchema);
