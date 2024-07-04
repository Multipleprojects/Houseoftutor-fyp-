import axios from 'axios'; // Importing axios for making HTTP requests
import React, { useEffect, useState } from 'react'; // Importing React hooks
import { useSelector } from 'react-redux'; // Importing useSelector hook from react-redux
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom
const Student_todayclass = () => {
  const navigate = useNavigate(); // Initializing the navigate function using useNavigate
  const Loginid = useSelector((state) => state.tutor.loginid); // Accessing loginid from Redux store
  const [schedule, setSchedule] = useState([]); // Initializing schedule state variable using useState  
  const currentDate = new Date(); // Getting the current date
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']; // Array of days of the week
  const currentDay = daysOfWeek[currentDate.getDay()]; // Getting the current day of the week
  const [action,setaction]=useState();
  // Array of valid times for sorting purposes
  const timeValidate = [
    '9:00am to 10:00am', '10:00am to 11:00am', '11:00am to 12:00pm',
    '12:00pm to 1:00pm', '1:00pm to 2:00pm', '2:00pm to 3:00pm', '3:00pm to 4:00pm'
  ];
  // Function to fetch data from the server
  const fetchData = async () => {
    try {
      // Making a GET request to the server to fetch tutor data
      const responsetutor = await axios.get(`${window.location.origin}/tutor`);
      const filteredValues = []; // Array to store filtered tutor data
      // Iterating over each tutor in the response data
      responsetutor.data.forEach(async (tutor) => {
        // Checking if the current tutor's student ID matches the logged-in user's ID
        if (tutor.studentdetail._id === Loginid) {
          // Checking if the tutor's status is '0'
          if (tutor.status === '0') {
            // Filtering the schedule to get classes for the current day
            const todayClasses = tutor.tutordetail.schedule.filter(classItem => classItem.day.toLowerCase() === currentDay);
            // If there are classes for the current day, add the tutor and their classes to filteredValues
            if (todayClasses.length > 0) {
              filteredValues.push({ ...tutor, todayClasses });
            }
          }
          // If the class was held, send a PUT request to update the attendance status
          // Checking if the class was held, then prompt user for attendance
if (tutor.tutordetail.status[0].held === true) {
  // Open modal or prompt user
  const confirmAttendance = window.confirm(`Would you like to mark attendance for  class? `); //${tutor.tutordetail.course}
  if (confirmAttendance) {
    try {
      // Send a PUT request to update attendance
      const response = await axios.put(`${window.location.origin}/schedule/${tutor.tutordetail._id}`, { action: 'attendence' });
      alert(response.data.message); // Displaying a success message
    } catch (error) {
      console.log(`Error updating status: ${error.response ? error.response.data.message : error.message}`); // Displaying error message
    }
  } else {
    // Handle if user chooses not to mark attendance
    // Optionally close modal or take other actions
  }
}

        }
      });
      setSchedule(filteredValues); // Updating the state with filtered values
    } catch (error) {
      console.error('Error fetching schedule:', error); // Logging any errors
    }
  };

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to sort the schedule by time
  const sortScheduleByTime = (a, b) => {
    return timeValidate.indexOf(a.time) - timeValidate.indexOf(b.time);
  };

  return (
    <div className='course_back p-3'>
      <div className='rounded border border-light p-4 ' style={{ backgroundColor: 'white' }}>
        <div className='scrollable-course'>
          <table className='table border-default table-hover'>
            <thead>
              <tr>
                <th scope="col" className='text-center'>Course</th>
                <th scope="col" className='text-center'>Day</th>
                <th scope="col" className='text-center'>Time</th>
              </tr>
            </thead>
            <tbody>
              {schedule && schedule.map((entry, index) => (
                entry.todayClasses && entry.todayClasses.length > 0 && entry.todayClasses
                  .sort(sortScheduleByTime) // Sorting the classes by time
                  .map((classItem, innerIndex) => (
                    <tr key={index + innerIndex}>
                      {innerIndex === 0 && ( // Display course name only once for the first class of the day
                        <td className='text-center' rowSpan={entry.todayClasses.length}>
                          {entry.tutordetail.course}
                        </td>
                      )}
                      <td className='text-center'>{classItem.day}</td>
                      <td className='text-center'>{classItem.time}</td>
                    </tr>
                  ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ float: 'right' }} className='d-flex gap-2 mt-2'>
        <button
          type="submit"
          className="btn btn-light text-center"
          onClick={() => navigate('/student/dashboard')} // Navigating to the student dashboard
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};
export default Student_todayclass;
