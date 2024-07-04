const mongoose=require('mongoose')
const Course_schema=new mongoose.Schema({
    reg_number:{ type: String },
    detail:[{
        course_title:String,
        grade:{type:String,default:'Offer'},
        rating:Number
    }]
})
const Course_model=mongoose.model('Course_model',Course_schema)
module.exports=Course_model