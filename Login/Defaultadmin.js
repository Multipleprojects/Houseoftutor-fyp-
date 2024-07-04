//store default admin data
// Function to insert default admin data
const Admin=require('../Models/Admin')
 const insertDefaultAdmin=async()=> 
 {
    try {
        // Check if the default admin already exists in the database
        const existingAdmin = await Admin.findOne({ name: "mudassir bhatti", password: "3240228166684" });
        // If the default admin doesn't exist, insert it into the database
        if (!existingAdmin) {
            const defaultAdmin = new Admin({
                name: "mudassir bhatti",
                password: "3240228166684"
            });
            await defaultAdmin.save();
            console.log('Default admin data inserted successfully.');
        } else {
            console.log('Default admin already exists in the database.');
        }
    } catch (error) {
        console.error('Error inserting default admin data:', error);
    }
}
//Add another Admin
const Addadmin=async(req,res)=>{
    try{
    const {name,password}=req.body;
    const existdata=await Admin.findOne({name:name,password:password})
    if(existdata){
        res.status(404).json("Given name or password already taken");
    }
    else{
            const newAdmin=new Admin({name,password});
            newAdmin.save();
            return res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    }
}
catch (error) {
    console.error('Error adding new admin:', error);
    return res.status(500).json({ message: "Error adding new admin", error });
}
}
module.exports = {
    insertDefaultAdmin,
Addadmin
};