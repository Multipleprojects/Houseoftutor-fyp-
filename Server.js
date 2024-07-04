//import packages
const express = require("express");
const mongoose=require('mongoose')
const cors=require('cors');
const  bodyParser=require('body-parser')
const Admin=require('./Login/Defaultadmin')
const env=require('dotenv').config()
const path = require("path");

//use packages
const app = express();
//used for requests
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));
//same as cors
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());
//call modules
app.use('/login',require('./Login/Loginn'))
 app.use('/admin',require('./Signup/Add_Admin'));
app.use('/schedule',require('./Schedule/CreateSchedule'));
app.use('/studentdetail',require('./Routes/Studentdetail_routes'));
app.use('/coursedetail',require('./Routes/Coursesdetail_routes'));
app.use('/addadmin',require('./Routes/Addadmin'));

app.use('/tutor',require('./Routes/Tutor_routes'))
//connect database
mongoose.connect(process.env.DB_URL)
  .then(async () => {
    console.log("Database connected successfully");
    // Call function to insert default admin data
    await Admin.insertDefaultAdmin();
  })
  .catch((err) => console.log("Error occurred in database:"));//display something
  app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "frontend", "build")));
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    });
  //create PORT
const PORT=process.env.PORT;
app.listen(PORT, () => console.log("Server running on port " + PORT));