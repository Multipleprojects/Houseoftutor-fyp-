import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Coursename } from '../Redux Toolkit/Slice'; // Adjust the path as per your project structure
import { useNavigate } from 'react-router-dom';
const Tutor_schedule = () => {
  const navigate = useNavigate();
  const getCourses = useSelector((state) => state.tutor.coursename);
  const reg_number = useSelector((state) => state.tutor.reg_number);
  const loginId = useSelector((state) => state.tutor.loginid);
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [scheduleData, setScheduleData] = useState([]); // Ensure scheduleData is initialized as an array

  // Function to fetch courses and populate dropdown
  const fetchCourses = async () => {
    try {
      const studentResponse = await axios.get(`${window.location.origin}/studentdetail/${loginId}`);
      const courseResponse = await axios.get(`${window.location.origin}/coursedetail`);
      const studentRegNumber = studentResponse.data.reg_number;
      const filteredCourses = courseResponse.data.filter(course => course.reg_number === studentRegNumber);
      if (filteredCourses.length > 0) {
        const validCourses = filteredCourses[0].detail
          .filter(course =>
            course.course_title &&
            course.course_title.trim() !== '' &&
            course.grade !== 'F' &&
            course.grade !== 'Offer'
          )
          .sort((a, b) => a.course_title.localeCompare(b.course_title));
        setCourses(validCourses);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to fetch schedule data
  const fetchScheduleData = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/schedule`);
      const fetchedSlots = [];
      const fetchedScheduleData = []; // Initialize an empty array to store schedule data
      response.data.forEach(val => {
        if (val.reg_number === reg_number) {
          fetchedScheduleData.push(val); // Add each relevant schedule to the array
          val.schedule.forEach(detail => {
            fetchedSlots.push({ day: detail.day, time: detail.time, id: val._id });
          });
        }
      });
      setSelectedSlots(fetchedSlots);
      setScheduleData(fetchedScheduleData); // Set the state with the fetched schedule data
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  // useEffect to fetch initial data on component mount
  useEffect(() => {
    fetchCourses();
    fetchScheduleData();
  }, []);

  // Function to handle deletion of schedule entry
  const handleDelete = async (day, time, id) => {
    try {
      const response = await axios.delete(`${window.location.origin}/Schedule/${id}/${day}/${time}`);
      if (response.status === 200) {
        // Remove the deleted schedule entry from the local state
        setScheduleData(prevScheduleData =>
          prevScheduleData.map(scheduleItem => {
            if (scheduleItem._id === id) {
              return {
                ...scheduleItem,
                schedule: scheduleItem.schedule.filter(entry => entry.day !== day || entry.time !== time)
              };
            }
            return scheduleItem;
          })
        );
        setSelectedSlots(selectedSlots.filter(slot => !(slot.day === day && slot.time === time && slot.id === id)));
        alert(response.data.message);
      } else {
        throw new Error('Failed to delete schedule');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Error deleting schedule. Please try again later.');
    }
  };

  // Function to handle checkbox change
  const handleCheckboxChange = async (day, time) => {
    const index = selectedSlots.findIndex(slot => slot.day === day && slot.time === time);
    if (index === -1) {
      // Add new slot
      setSelectedSlots([...selectedSlots, { day, time }]);
      try {
        const response = await axios.post(`${window.location.origin}/schedule`, {
          course: getCourses.course_title,
          day,
          time,
          reg_number,
          rating: getCourses.rating,
          grade: getCourses.grade,
          studentId: loginId
        });
        if (response.data.message.includes('Schedule conflict')) {
          alert(response.data.message);
        } else if (response.data.message.includes('required fields')) {
          alert('Both day and time are required fields');
        } else if (response.data.message.includes('Day and time added') || response.data.message.includes('New schedule entry created')) {
          alert(response.data.message);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      // Remove existing slot
      const slotToDelete = selectedSlots[index];
      await handleDelete(slotToDelete.day, slotToDelete.time, slotToDelete.id);
    }
    fetchScheduleData();
  };
  // Function to handle course change
  const handleCourseChange = (event) => {
    const selectedCourseTitle = event.target.value;
    const selectedCourse = courses.find(course => course.course_title === selectedCourseTitle);
    dispatch(Coursename(selectedCourse || {}));
  };

  // Days and times for the schedule table
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const times = [
    '9:00am to 10:00am', '10:00am to 11:00am', '11:00am to 12:00pm',
    '12:00pm to 1:00pm', '1:00pm to 2:00pm', '3:00pm to 4:00pm'
  ];

  // JSX return for the component
  return (
    <div className='p-2 course_back'>
      <div className="rounded border p-4" style={{ backgroundColor: 'white' }}>
        <div className='schedule_flex'>
          <p><span className='fw-bold text-primary'>Course Title: </span>{getCourses.course_title || "No course selected"}</p>
          <select onChange={handleCourseChange} className='rounded border border-primary space-dropdown'>
            <option value="">Select a course</option>
            {courses.map((course, index) => (
              <option key={index} value={course.course_title}>
                {course.course_title}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th></th>
                {days.map((day, index) => (
                  <th key={index}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time, index) => (
                <tr key={index}>
                  <td>{time}</td>
                  {days.map((day, dayIndex) => (
                    <td key={dayIndex}>
                      <input
                        type="checkbox"
                        checked={selectedSlots.some(slot => slot.day === day && slot.time === time)}
                        onChange={() => handleCheckboxChange(day, time)}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className='txt-color fs-3 fw-bold'>Already Created Schedule Here</p>
          <div className='scrollable-schedule'>
            <table className="table border-default table-hover">
              <thead>
                <tr>
                  <th>Course name</th>
                  <th className='text-center'>Day</th>
                  <th className='text-center'>Time</th>
                </tr>
              </thead>
              <tbody style={{ color: 'white' }} className='rounded p-2'>
                {scheduleData.map((val, index) => (
                  <React.Fragment key={index}>
                    {val.schedule.map((dayDetail, detailIndex) => (
                      <tr key={`${index}-${detailIndex}`}>
                        <td>{val.course}</td>
                        <td className='text-center'>{dayDetail.day}</td>
                        <td className='text-center'>{dayDetail.time}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style={{ float: 'right' }} className='d-flex gap-2'>
        <button
          type="button"
          className="btn btn-light mt-2 text-center"
          onClick={() => navigate('/tutor/dashboard/course/detail')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-light mt-2 text-center"
          onClick={() => navigate('/tutor/dashboard')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};
export default Tutor_schedule;