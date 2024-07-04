    const Tutor = require('../Models/Student_requests')
    const Coursedetail=require('../Models/Courses')
    const schedule=require('../Models/Schedule')
    //create tutor
    exports.createTutor = async (req, res) => {
        try {
            const { studentdetail, tutordetail,duration } = req.body; // Get the data from the request body
    // Check if any tutor matches the provided duration
    const existingDuration = await Tutor.findOne({ duration: duration });
    if (existingDuration) {
        return res.status(200).json({ message: "Duration already exists" });
    }
            const existingTutor = await Tutor.findOne({
                'studentdetail._id': studentdetail._id,
                'tutordetail':tutordetail._id,   
            }); 
                        if (existingTutor) {
                            // Update existing tutor details
                            existingTutor.studentdetail = studentdetail;
                            existingTutor.tutordetail = tutordetail;
                            existingTutor.duration=duration;
                            await existingTutor.save();
                            res.status(200).json({ message: 'Tutor details updated successfully', id: existingTutor._id });

                        } else {
            // Create a new tutor instance
                const newTutor = new Tutor({
                    studentdetail,
                    tutordetail,
                    duration            
                });
                // Save the tutor to the database
                await newTutor.save();
                res.status(201).json({ message: 'Request sent to Tutor successfully', id:newTutor._id });
        } 
    }
    catch (error) {
            res.status(500).json({ message: error.message }); // Send error message
        }
    };
    //Get method
    exports.GetTutor = async (req, res) => {
        try {
            const Disp = await Tutor.find()
                .populate({
                    path: 'tutordetail'
                })
                .populate({
                    path: 'studentdetail',
                    select: 'name reg_number' // Select specific fields from studentdetail
                });
                res.status(200).json(Disp);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    const timers = {}; // Object to store timers for each tutor
    exports.updateStatus = async (req, res) => {
        const tutorId = req.params.id;
        const { status } = req.body;
        try {
            // Find the tutor by ID
            const tutor = await Tutor.findById(tutorId)
                .populate('tutordetail')
                .populate('studentdetail');
            if (!tutor) {
                return res.status(404).json({ message: 'Tutor not found' });
            }
            // Update the status of the current tutor
            tutor.status = status;
            await tutor.save();
            if (status === '0') {
                if (timers[tutorId]) {
                    clearTimeout(timers[tutorId]);
                    delete timers[tutorId];
                }
                // Your existing logic
                return res.status(200).json({message:"Request Status accepted success"});
            }
            else if (status === '1') {
                // Clear any existing timer for this tutor
                if (timers[tutorId]) {
                    clearTimeout(timers[tutorId]);
                    delete timers[tutorId];
                }
                // Start a new timer for 1 minute
                timers[tutorId] = setTimeout(async () => {
                    // Timer ended, change status to 2
                    tutor.status = '2';
                    await tutor.save();
                    // Clean up the timer reference
                    delete timers[tutorId];
                }, 24 * 60 * 60 * 1000); // 24 hours in
                console.log("Timer started for status 1");
                return res.status(200).json({message:"Status set to 1, will change to 2 after 1 minute"});
            } else if (status === '2') {
                // Clear any existing timer for this tutor
                if (timers[tutorId]) {
                    clearTimeout(timers[tutorId]);
                    delete timers[tutorId];
                }
                return res.status(200).json({message:"Request Status rejected"});
            }
            else if(status==='complete')
            {
                if (timers[tutorId]) {
                    clearTimeout(timers[tutorId]);
                    delete timers[tutorId];
                }
                tutor.status = '2';
                await tutor.save();
                return res.status(200).json({message:"Given course have complete duration"});
            }
        } catch (error) {
            console.error({message:'Error updating status:', err:error});
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    // DELETE method to delete all tutors
    exports.deleteAllTutors = async (req, res) => {
        try {
            await Tutor.deleteMany({}); // Deletes all tutors
            res.status(200).json({ message: 'All tutors deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    //update status and rating on baiss of duration complete
    exports.updateRatingAndStatus = async (req, res) => {
        const loginId = req.params.id;
        const { rating } = req.body;
        const currentDateTime = new Date();
        //currentDateTime.setHours(0, 0, 0, 0); // Normalize to midnight
        const courserating=await Coursedetail.find();
        const Schedule=await schedule.find();
        try {
            const tutors = await Tutor.find().populate('tutordetail').populate('studentdetail');
            let updateMade = false;
            await Promise.all(tutors.map(async (val) => {
                if (val.studentdetail._id.toString() === loginId && val.status==='0') {
                    const tutorDuration = new Date(val.duration);
        //          tutorDuration.setHours(0, 0, 0, 0); // Normalize to midnight
                    if (currentDateTime >= tutorDuration) {
                        // Update the tutor details
                        val.status = '2';
      val.message=true;
                        val.duration = null;
                        await val.save();
                        {
                            courserating.map((rate)=>{
                                Schedule.map((sch)=>{
                                    {
                                if(rate.reg_number===val.tutordetail.reg_number && sch.reg_number===val.tutordetail.reg_number)
                                    {
                                        rate.detail.map((update)=>{
                                            if(update.course_title===val.tutordetail.course && val.tutordetail.course===sch.course)
                        {            
                                        update.rating +=Number(rating);
                                        rate.save();   
                                        sch.rating +=Number(rating);
                                        sch.save();
                                                }
                                        })
                                    }
                        } }) })
                        }
                    
                        updateMade = true;
                        }
                }
            }));
            if (updateMade) {
                res.status(200).json("Tutor details updated");
            } else {
                res.status(200).json("No updates made. Current date/time is earlier than the tutor's duration or no matching ID found.");
            }
        } catch (error) {
            console.error('Error updating status and ratings:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    //update duration null if request status 2
    exports.updateduration = async (req, res) => {
        try {
            const loginId = req.params.id;
            const { duration } = req.body;
            // Find all tutor records by id
            let tutorRecords = await Tutor.find().populate('tutordetail');
            if (!tutorRecords || tutorRecords.length === 0) {
                return res.status(404).json({ message: "Tutor records not found" });
            }
            // Filter records where studentId matches and status is 2
            for (let tutorRecord of tutorRecords) {
                if (tutorRecord.tutordetail.studentId.toString() === loginId && tutorRecord.status === '2') {
                    tutorRecord.duration = duration;
                    await tutorRecord.save();
                }
            }
            if (updatedCount === 0) {
                return res.status(400).json({ message: "No matching records found to update" });
            }
            return res.status(200).json({ message: `record(s) updated successfully` });
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    };