// Import mongoose
const mongoose = require('mongoose');
// Define main schema
const Student_schema = new mongoose.Schema({
  name:String,
  fname:String,
  cnic:{ type: String, unique:true },
  fcnic:String,
  semester:String,
  reg_number:{ type: String, unique: true },
  cgpa:String,
  password:String,
  fpassword:String
});
// Create model
const Student_model = mongoose.model('Student_model', Student_schema);
// Export model
module.exports = Student_model;
