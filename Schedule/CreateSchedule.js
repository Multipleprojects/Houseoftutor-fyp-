const express = require('express');
const router = express.Router();
const Schedule = require('../Models/Schedule'); // Assuming your model is in the models directory
router.post('/', async (req, res) => {
    try {
        // Extract data from request body
        const { course, rating, grade, reg_number, day, time, studentId } = req.body;
        // Check if day or time is empty
        if (!day || !time) {
            return res.status(400).json({ message: 'Both day and time are required fields' });
        }
        // Construct the schedule object
        const schedule = { day, time };
        // Fetch all schedules for the given registration number
        const schedules = await Schedule.find({ reg_number });
        // Check for any conflicting schedules within the same registration number
        for (let existingSchedule of schedules) {
            const conflictingSchedule = existingSchedule.schedule.find(item => item.day === day && item.time === time);
            if (conflictingSchedule) {
                return res.status(200).json({ message: 'Schedule conflict: Another schedule already exists with the same day and time' });
            }
        }
        // Check if the same course exists for the same reg_number
        const existingCourse = await Schedule.findOne({ reg_number, course });
        if (existingCourse) {
            existingCourse.schedule.push(schedule);
            await existingCourse.save();
            return res.status(200).json({ message: 'Day and time added to existing course schedule' });
        }
        // If no schedule exists for the given registration number or course, create a new schedule entry
        const newSchedule = new Schedule({
            course,
            reg_number,
            studentId,
            rating,
            grade,
            schedule: [schedule], // Initialize the schedule array with the provided schedule
            status: { held: 0, cancel: 0, i: 0 } // Initialize the status values
        });
        await newSchedule.save();
        return res.status(200).json({ message: 'New schedule entry created' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
// DELETE route for deleting a specific schedule entry based on schedule ID, day, and time
router.delete('/:id/:day/:time', async (req, res) => {
   try {
        const { id, day, time } = req.params;
        // Find the schedule by its _id
        const existingSchedule = await Schedule.findById(id);
        if (!existingSchedule) {
            return res.status(404).json({ message: 'Schedule not found for the given _id' });
        }
        // Check if the day and time match to be deleted
        const index = existingSchedule.schedule.findIndex((item) => item.day === day && item.time === time);
        if (index === -1) {
            return res.status(404).json({ message: 'Schedule not found for the given day and time' });
        }
        // Remove the corresponding schedule entry
        existingSchedule.schedule.splice(index, 1);
        // Save the updated schedule
        await existingSchedule.save();
        res.status(200).json({ message: 'Schedule entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// PUT route for updating day and time of a specific schedule entry
router.put('/:id/:day/:time', async (req, res) => {
    try{
        const { id, day, time } = req.params;
        const { newDay, newTime } = req.body;
        // Find the schedule by its _id
        const existingSchedule = await Schedule.findById(id);
        if (!existingSchedule) {
            return res.status(404).json({ message: 'Schedule not found for the given _id' });
        }
        // Find the schedule entry by day and time
        const index = existingSchedule.schedule.findIndex(item => item.day === day && item.time === time);
        if (index === -1) {
            return res.status(404).json({ message: 'Schedule not found for the given day and time' });
        }
    // Check if the new day and time already exist in any other schedule entry for the same registration number
   const conflictSchedule = await Schedule.findOne({
    reg_number: existingSchedule.reg_number,
    _id: { $ne: id }, // Exclude the current schedule document
    'schedule.day': newDay,
    'schedule.time': newTime
});
if (conflictSchedule) {
    return res.status(400).json({ message: 'Day and time conflict: Another schedule already exists with the same day and time' });
}
        // Update the day and time if provided
        if (newDay) existingSchedule.schedule[index].day = newDay;
        if (newTime) existingSchedule.schedule[index].time = newTime;
        // Save the updated schedule
        await existingSchedule.save();
        res.status(200).json({ message: 'Day and time updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });
//get method
router.get('/', async (req, res) => {
  try {
    // Fetch all schedules from the database, populating excelDataId to get Excel data
    const schedules = await Schedule.find().populate({path:"studentId",select:"name fcnic"});
      //  select: 'courses' // Select only the name field
    // Respond with the fetched schedules
   res.status(200).json(schedules);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//get by reg_number
router.get('/:reg_number', async (req, res) => {
    try {
      const { reg_number } = req.params;
      const schedules = await Schedule.find({ reg_number });
      res.status(200).json(schedules);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// Delete all users
router.delete('/',async(req, res) => {
    try {
        // Delete all users from MongoDB
        await Schedule.deleteMany({});
        // Respond with success message
        res.status(200).json("All users deleted successfully");
    } catch (error) {
        // Handle errors
        console.error("Error occurred in deleting all users", error);
        res.status(500).json("Error occurred in deleting all users");
    }
});
//attendence allow per day
// router.put('/:id', async (req, res) => {
//   try {
//     const Id = req.params.id;
//     const { action } = req.body;
//     const schedule = await Schedule.findById(Id);
    
//     if (!schedule) {
//       return res.status(404).json({ message: 'Schedule not found' });
//     }

//     const now = new Date();
//     const lastActionTime = schedule.status[0].lastActionTime;

//     // Check if lastActionTime is today
//     const lastActionDate = lastActionTime.toISOString().split('T')[0];
//     const currentDate = now.toISOString().split('T')[0];

//     if (['held', 'cancel'].includes(action)) {
//       if (lastActionDate === currentDate) {
//         return res.status(400).json({ message: 'Action can only be performed once per day' });
//       }
//     }

//     if (action === 'held') {
//       schedule.status[0].held = true;
//       schedule.status[0].lastActionTime = now;
//       await schedule.save();
//       return res.status(200).json({ message: 'Schedule held status updated successfully' });
//     } else if (action === 'cancel') {
//       schedule.status[0].held = false;
//       schedule.status[0].cancel += 1;
//       schedule.status[0].lastActionTime = now;
//       await schedule.save();
//       return res.status(200).json({ message: 'Schedule cancel status updated successfully' });
//     } else if (schedule.status[0].held === true) {
//       if (action === 'attendence') {
//         schedule.status[0].held = false;
//         schedule.status[0].attendence += 1;
//         await schedule.save();
//         return res.status(200).json({ message: 'Schedule attendence status updated successfully' });
//       } else {
//         return res.status(400).json({ message: 'Invalid action attendence' });
//       }
//     } else {
//       return res.status(400).json({ message: 'Invalid action' });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: 'Error occurred in updating status', error: err });
//   }
// });
//put method for schedule
//taken attendence
router.put('/:id', async (req, res) => {
  try {
    const Id = req.params.id;
    const { action } = req.body;
    const schedule = await Schedule.findById(Id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    const now = new Date();
    const lastActionTime = schedule.status[0].lastActionTime;
    const twoMinutes = 1 * 60 * 1000; //user held or cancel once every one minutes millisecond
    const thirtyminutes = 1 * 60 * 1000; //24 hour 24*60*60*1000 automatic cancel
const startThirtySecondTimer = () => {
  setTimeout(async () => {
    const updatedSchedule = await Schedule.findById(Id);
    if (updatedSchedule && updatedSchedule.status[0].held === true) {
      schedule.status[0].held = false;
      schedule.status[0].cancel += 1;
      await schedule.save();
      console.log("done increment")
    } else {
      console.log("Auto-canceled after 30 minutes");
    }
  }, thirtyminutes); // 30 seconds in milliseconds
};
    if (['held', 'cancel'].includes(action)) {
      if (now - lastActionTime < twoMinutes) {
        return res.status(400).json({ message: 'Action can only be performed once per day' });
      }
    }
    if (action === 'held') {
      schedule.status[0].held = true;
      schedule.status[0].lastActionTime = now;
      await schedule.save();
      startThirtySecondTimer(); // Start the 30-second timer
      return res.status(200).json({ message: 'Schedule held status updated successfully' });
    } 
    else if (action === 'cancel') {
      schedule.status[0].held = false;
      schedule.status[0].cancel += 1;
      schedule.status[0].lastActionTime = now;
      await schedule.save();
      return res.status(200).json({ message: 'Schedule cancel status updated successfully' });
    } 
    else if (schedule.status[0].held === true) {
      if (action === 'attendence') {
        if (now - lastActionTime < thirtyminutes){
        schedule.status[0].held = false;
        schedule.status[0].attendence += 1;
        schedule.status[0].lastAttendenceTime = now;
        await schedule.save();
        return res.status(200).json({ message: 'Schedule attendence status updated successfully' });
      } 
    }
    else{
      console.log('Schedule cancel status updated successfully');
    }
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error occurred in updating status', error: err });
  }
});

//tutor update
router.put('/tutor/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const tutor = await Schedule.findByIdAndUpdate(id, req.body, { new: true });
      if (!tutor) {
        return res.status(404).json({ message: "Given ID is incorrect" });
      }
      return res.status(200).json({ message: "Tutor status updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error occurred updating tutor status", error: error.message });
    }
  });
module.exports = router;