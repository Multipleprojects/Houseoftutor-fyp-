
// Import mongoose
const mongoose = require('mongoose');
// Define main schema
const Tutorschema = new mongoose.Schema({
    tutordetail:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Schedule_model'
    },
    studentdetail:{  
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student_model'
    },
    status:{
        type:String,
    },
    duration:{
        type:Date,
    },
    message:{
        type:Boolean,
        default:false
    }
});
//define model
const Tutormodel=mongoose.model('Tutormodel',Tutorschema);
module.exports=Tutormodel