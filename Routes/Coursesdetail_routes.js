//import packages
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
//import module
const Controller=require('../Controller/Courses_controller')
//init app and setting up middleware 
const router = express.Router();
router.use(bodyParser.urlencoded({extended:true}));
//create static folder
router.use(express.static(path.resolve(__dirname, 'public')))
//multer  for file uploading
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/coursefile')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload=multer({storage:storage}).single('coursefile');
//post method
router.post('/',upload,Controller.importCourses)
// //delete method
// router.delete('/:id', Controller.DeleteUser);
//delete All data
router.delete('/', Controller.DeleteAllUsers);
//display data
router.get('/', Controller.display);
//update grade
router.put('/',Controller.Updategrade);
//Delete by detail id
router.delete('/:courseid/:detailid',Controller.Deletegivenid);
module.exports = router
