const express = require('express');
const CourseModel = require('../Models/Courses');
const xlsx = require('xlsx');
const fs = require('fs');

// Post method for importing courses
const importCourses = async (req, res) => {
    try {
        const userData = [];
        const errorMessages = [];
        let updateMessage = '';
        const workbook = xlsx.readFile(req.file.path);
        const sheet_name_list = workbook.SheetNames;
        const sheet = workbook.Sheets[sheet_name_list[0]];
        const response = xlsx.utils.sheet_to_json(sheet);
        const expectedFields = ['reg_number', 'course_title', 'grade', 'rating'];
        const fileColumns = Object.keys(response[0]);
        const isValidFile = expectedFields.every(field => fileColumns.includes(field));

        if (!isValidFile) {
            errorMessages.push("Uploaded file columns do not match the schema.");
        } else {
            for (let row of response) {
                if (!row.reg_number || !row.course_title || !row.grade) {
                    errorMessages.push(`Missing required fields for reg_number: ${row.reg_number}. Please ensure reg_number, course_title, and grade are provided.`);
                    continue;
                }

                const courses = row.course_title.split('\n').map(course => course.trim());
                const grades = row.grade.split('\n').map(grade => grade.trim());
                const ratings = row.rating ? row.rating.split('\n').map(rating => rating.trim()) : [];
                const coursesWithGrades = courses.map((course, i) => ({
                    course_title: course,
                    grade: grades[i],
                    rating: ratings[i] || null
                }));

                let existingUser = await CourseModel.findOne({ reg_number: row.reg_number });
                if (existingUser) {
                    const existingDetail = existingUser.detail;
                    coursesWithGrades.forEach(newCourse => {
                        const existingCourseIndex = existingDetail.findIndex(course => course.course_title === newCourse.course_title);
                        if (existingCourseIndex !== -1) {
                            existingDetail[existingCourseIndex].grade = newCourse.grade;
                            existingDetail[existingCourseIndex].rating = newCourse.rating;
                        } else {
                            const newCourseIndex = userData.findIndex(user => user.reg_number === row.reg_number);
                            if (newCourseIndex !== -1) {
                                const courseExists = userData[newCourseIndex].detail.some(course => course.course_title === newCourse.course_title);
                                if (courseExists) {
                                    errorMessages.push(`Course ${newCourse.course_title} already exists for reg_number: ${row.reg_number} in the import data.`);
                                } else {
                                    existingDetail.push({
                                        course_title: newCourse.course_title,
                                        grade: newCourse.grade,
                                        rating: newCourse.rating
                                    });
                                }
                            } else {
                                existingDetail.push({
                                    course_title: newCourse.course_title,
                                    grade: newCourse.grade,
                                    rating: newCourse.rating
                                });
                            }
                        }
                    });

                    existingUser.detail = existingDetail;
                    await existingUser.save();
                    updateMessage = 'Course data updated successfully';
                } else {
                    let newUser = userData.find(user => user.reg_number === row.reg_number);
                    if (newUser) {
                        errorMessages.push(`Registration number ${row.reg_number} already exists.`);
                    } else {
                        userData.push({
                            reg_number: row.reg_number,
                            detail: coursesWithGrades,
                        });
                    }
                }
            }
        }

        if (userData.length > 0) {
            await CourseModel.insertMany(userData);
        }

        if (errorMessages.length > 0) {
            res.status(400).json({ errors: errorMessages, message: updateMessage });
        } else {
            res.status(200).json({ message: `Courses detail excel file imported successfully. ${updateMessage}` });
        }
    } catch (error) {
        console.error("Error occurred in Controller", error);
        res.status(500).json({ errors: ["Error occurred in Controller"] });
    } finally {
        fs.unlinkSync(req.file.path);
    }
};

module.exports = importCourses;



// Display data
const display = async (req, res) => {
    try {
        const courses = await CourseModel.find();
        res.status(200).json(courses);
    } catch (err) {
        console.log("Error occurred in display method", err);
        res.status(500).json("Error occurred in display method");
    }
}
// Delete all users
const DeleteAllUsers = async (req, res) => {
    try {
        // Delete all users from MongoDB
        await CourseModel.deleteMany({});
        // Respond with success message
        res.status(200).json("All users deleted successfully");
    } catch (error) {
        // Handle errors
        console.error("Error occurred in deleting all users", error);
        res.status(500).json("Error occurred in deleting all users");
    }
};
// Update grade function
const Updategrade = async (req, res) => {
    try {
        const { regno, course, grade } = req.body;
        const courseData = await CourseModel.findOne({ reg_number: regno });
        if (!courseData) {
            return res.status(404).json("Such regnumber not found");
        } else {
            let courseFound = false;
            // Iterate over course details
            courseData.detail.forEach((val) => {
                if (course === val.course_title) {
                    val.grade = grade;
                    courseFound = true;
                }
            });
            if (courseFound) {
                await courseData.save();
                return res.status(200).json("Grade updated successfully");
            } else {
                return res.status(404).json("Course not found");
            }
        }
    } catch (err) {
        return res.status(500).json("Error occurred in update method");
    }
};
// Delete by id function
const Deletegivenid = async (req, res) => {
    const { courseid, detailid } = req.params;
    try {
        const courseData = await CourseModel.findById(courseid);
        if (!courseData) {
            return res.status(404).json("Given course ID not found in DB");
        } else {
            let detailFound = false;
            courseData.detail.forEach((val, index) => {
                if (val._id.toString() === detailid) {
                    courseData.detail.splice(index, 1);
                    detailFound = true;
                }
            });
            if (!detailFound) {
                return res.status(404).json("Detail ID not found in the given course");
            }
            await courseData.save();
            return res.status(200).json("Detail item deleted successfully");
        }
    } catch (err) {
        return res.status(500).json("Error occurred in delete by detail id method");
    }
};
module.exports = { display, importCourses, DeleteAllUsers, Updategrade, Deletegivenid };
  
