const Studentdetail = require('../Models/Student_detail');  // Importing Studentdetail model/schema
const xlsx = require('xlsx');  // Importing xlsx module for parsing Excel files
const fs = require('fs');  // Importing fs module for file system operations
//Define the import function as an asynchronous function
const Importstudent = async (req, res) => {
    try {
        const userData = [];  // Initialize an empty array to store user data from Excel
        let updateMessage = '';  // Initialize an empty string for update message
        let successMessage = '';  // Initialize an empty string for success message
        // Read Excel file using fs and xlsx
        const workbook = xlsx.readFile(req.file.path);  // Read Excel file from the path provided in request
        const sheet_name_list = workbook.SheetNames;
        // Assuming there is only one sheet in the Excel file, and it is the first one
        const sheet = workbook.Sheets[sheet_name_list[0]];
        // Convert Excel sheet to JSON format
        const response = xlsx.utils.sheet_to_json(sheet);
        // Schema fields
        const schemaFields = Object.keys(Studentdetail.schema.paths);
        // Validate if Excel file columns match the schema fields
        const fileColumns = Object.keys(response[0]);
        const isValidFile = fileColumns.every(column => schemaFields.includes(column));
        if (!isValidFile) {
            return res.status(200).json("Uploaded file columns do not match the schema.");
        }
        // Check for empty fields and process each row in the Excel sheet
        for (let row of response) {
            if (!row.semester || row.semester.trim() === "" || !row.cgpa || row.cgpa.trim() === "" || !row.cnic || row.cnic.trim() === "" ) {
                return res.status(400).json(`Field semester or cgpa contains an empty value for reg_number:`);
            }
            // Check if CNIC already exists
            const existingStudentByCNIC = await Studentdetail.findOne({ cnic: row.cnic });
            // Check if reg_number already exists in the database
            const existingStudent = await Studentdetail.findOne({ reg_number: row.reg_number });
            if (existingStudent) {
                // Check if semester or cgpa fields are empty
                if (!row.semester || row.semester.trim() === "" || !row.cgpa || row.cgpa.trim() === "") {
                    return res.status(400).json(`Field semester or cgpa contains an empty value for reg_number: ${row.reg_number}.`);
                }
                // Update existing document if reg_number is found
                existingStudent.semester = row.semester;
                existingStudent.cgpa = row.cgpa;
                await existingStudent.save();  // Save the updated document
                updateMessage = "Student data updated successfully";  // Set update message
            } else {
            if (existingStudentByCNIC) {
                return res.status(400).json(`Duplicate CNIC found: ${row.cnic}. Please ensure all CNICs are unique.`);
            }
                // If reg_number does not exist, store Excel data in userData array
                userData.push({
                    name: row.name,
                    fname: row.fname,
                    cnic: row.cnic,
                    fcnic: row.fcnic,
                    semester: row.semester,
                    reg_number: row.reg_number,
                    cgpa: row.cgpa,
                    password: row.password,
                    fpassword: row.fpassword
                });
            }
        }

        // Insert new parsed data into MongoDB if there are new records
        if (userData.length > 0) {
            try {
          await Studentdetail.insertMany(userData);  // Insert multiple documents into MongoDB
                successMessage = 'Student detail Excel file imported successfully';
            } catch (error) {
                // Handle duplicate key error when reg_number is not unique
                if (error.code === 11000 && error.keyValue && error.keyPattern) {
                    // MongoDB duplicate key error handling for unique index violation
                    const duplicateKey = Object.keys(error.keyPattern)[0];
                    return res.status(400).json(`Duplicate ${duplicateKey} found in the Excel file. Please ensure all ${duplicateKey}s are unique.`);
                } else {
                    throw error;  // Throw any other unexpected errors
                }
            }
        }

        // Construct final response message
        if (updateMessage) {
            successMessage += ` && ${updateMessage}`;
        }

        return res.status(200).json(successMessage);

    } catch (error) {
        // Handle errors that occur during the process
        console.log("Error occurred in Controller", error);
        return res.status(500).json("Error occurred in Controller");  // Respond with error status and message
        
    } finally {
        // Delete the uploaded Excel file from the server
        fs.unlinkSync(req.file.path);  // Remove the file synchronously after processing
    }
};
//Delete data by id
const DeleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Studentdetail.findByIdAndDelete(userId);
        if (!user) return res.status(404).send("The user with the given ID was not found")
            return res.send("deleted succesfully");
        } catch (error) {
        // Handle errors
        console.error("Error occurred in deleting user", error);
        res.status(500).json("Error occurred in deleting user");
    }
};
//display data
const Display=async(req,res)=>{
    try{
const disp=await Studentdetail.find();
res.status(200).json(disp)
    }
    catch(err)
    {console.log("error occure display method")}
};
//Get by id
 const Getbyid=async(req,res)=>{
     try {
         const userId = req.params.id;
         // Find the user by ID in MongoDB
         const userData = await Studentdetail.findById(userId);
         // If user data found, send it as response
         if (userData) {
             res.status(200).json(userData);
         } else {
             // If user data not found, send 404 Not Found response
             res.status(404).json({ message: `User with ID '${userId}' not found` });
         }
     } catch (error) {
         // Handle errors
         console.error("Error occurred in getting user by ID", error);
                  res.status(500).json("Error occurred in getting user by ID");
    }
 };
 // Update user data by ID
const UpdateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDataToUpdate = req.body; // Assuming request body contains updated user data
        // Find the user by ID in MongoDB and update it
        const updatedUserData = await Studentdetail.findByIdAndUpdate(userId, userDataToUpdate, { new: true });
        // If user data updated successfully, send updated data as response
        if (updatedUserData) {
            res.status(200).json("data updated successfully");
        } else {
            // If user data not found, send 404 Not Found response
            res.status(404).json(`User with ID '${userId}' not found`);
        }
    } catch (error) {
        // Handle errors
        console.error("Error occurred in updating user", error);
        res.status(500).json("Error occurred in updating user");
    }
};
// Delete all users
const DeleteAllUsers = async (req, res) => {
    try {
        // Delete all users from MongoDB
        await Studentdetail.deleteMany({});
        // Respond with success message
        res.status(200).json("All users deleted successfully");
    } catch (error) {
        // Handle errors
        console.error("Error occurred in deleting all users", error);
        res.status(500).json("Error occurred in deleting all users");
    }
};
module.exports = { Importstudent, Display, DeleteAllUsers, Getbyid, DeleteUser, UpdateUser };