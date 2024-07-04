//import packages
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
//import module
const Controller=require('../Controller/Studentdetail_controller')
//init app and setting up middleware 
const router = express.Router();
router.use(bodyParser.urlencoded({extended:true}));
//create static folder
router.use(express.static(path.resolve(__dirname, 'public')))
//multer  for file uploading
var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/studentfile')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload=multer({storage:storage}).single('studentfile');
//post method
router.post('/',upload,Controller.Importstudent)
 //delete method
 router.delete('/:id', Controller.DeleteUser);
//delete All data
router.delete('/', Controller.DeleteAllUsers);
// //display data
router.get('/', Controller.Display);
//Update data
 router.put("/:id",Controller.UpdateUser)
// Get by id data
router.get('/:id', Controller.Getbyid);
module.exports = router
