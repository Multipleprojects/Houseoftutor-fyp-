//import packages
const express=require('express');
const Admin=require('../Models/Admin')
//use packages
const router = express.Router();
//Post method it apply when admin add other admin
router.post('/',async(req,res)=>{
    try{
    const {email,password}=req.body;
    const Check=await Admin.findOne({email,password});
    if(Check) {return res.status(200).json("email or password already taken")}
await Admin.create(req.body);
return  res.status(200).json("Another Admin Signup success")
    }
    catch(err){res.status(400).json("error occure in admin post method")}
})
//get method
router.get('/',async(req,res)=>{
    const Display=await Admin.find();
    res.status(200).json(Display)
})
//export module
module.exports=router