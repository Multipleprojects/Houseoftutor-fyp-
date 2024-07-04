// Import mongoose
const mongoose = require('mongoose');
// Define main schema
const Adminschema = new mongoose.Schema({
    name: { type: String, default: "mudassir bhatti" },
    password: { type: String, default: "3240228166684" },
});
//define model
const Admin=mongoose.model('Admin',Adminschema);
module.exports=Admin