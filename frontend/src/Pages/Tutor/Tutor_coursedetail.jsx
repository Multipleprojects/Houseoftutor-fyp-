import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
const Tutor_coursedetail = () => {
  const navigate = useNavigate();
  const Loginid = useSelector((state) => state.tutor.loginid);
  const course_detail = useSelector((state) => state.tutor.coursename);
  const Navigate = () => {
    if (course_detail.grade === 'Offer') {
      alert("You are not eligible to create Schedule because currently you are studying");
    } else if (course_detail.grade === 'F') {
      alert("You are not eligible to create Schedule because You Failed");
    } else {
      navigate('/tutor/dashboard/course/Schedule');
    }
  };
  const [Schedule, setSchedule] = useState(null);
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Schedule');
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };
useEffect(()=>{
fetchData()
},[])
    const handleDelete = async (day, time, id) => {
    try {
      const response = await axios.delete(`${window.location.origin}/Schedule/${id}/${day}/${time}`);
      if (response.status === 200) {
        // Remove the deleted schedule entry from the local state
        setSchedule(prevSchedule => {
          // Find the schedule with the matching ID
          const updatedSchedule = prevSchedule.find(schedule => schedule._id === id);
          if (updatedSchedule) {
            // Filter out the deleted day and time from the schedule
            updatedSchedule.schedule = updatedSchedule.schedule.filter(entry => entry.day !== day || entry.time !== time);
          }
          return [...prevSchedule];
        fetchData();
        });
        alert(response.data.message);
      } else {
        throw new Error('Failed to delete schedule');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Error deleting schedule. Please try again later.');
    }
  };
  // Custom sorting function for days
  const sortDays = (a, b) => {
    const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return daysOrder.indexOf(a) - daysOrder.indexOf(b);
  };
  return (
    <div className='course_back p-2'>
       <div className='rounded p-4 ' style={{backgroundColor:'white'}}>
      <div  className=' rounded '>
        <div className='d-flex flex-column  rounded p-1 pt-4 pb-2' style={{ backgroundColor: 'white' }}>
          <div className='d-flex justify-content-between p-2'>
            <p className='fw-bold '>Course name</p>
            <p>{course_detail.course_title}</p>
          </div>
          <div className='d-flex justify-content-between p-2'>
            <p className='fw-bold'>Grade</p>
            <p>{course_detail.grade}</p>
          </div>
          {course_detail.grade === 'Offer' || course_detail.grade === 'F' ? '' :
            <>
            <p className='fw-bolder fs-5 ' style={{color:'rgb(40, 134, 244)', marginLeft:'0.4rem'}}>Schedule:</p>
              <div className='rounded scrollable-schedule' >
                <table className={`table border-default table-hover `}  >
                  <thead>
                    <tr>
                      <th scope="col" >Day</th>
                      <th scope="col" className='text-center'>Time</th>
                      <th scope="col" className='text-center'>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                  {Schedule && Schedule.map(val => (
  val.course === course_detail.course_title && val.studentId._id === Loginid && (
    <>
      {val.schedule
        .sort((a, b) => sortDays(a.day.toLowerCase(), b.day.toLowerCase())) // Sort days
        .map((day,index) => (
          <tr key={index}>
            <td >{day.day}</td>
            <td className='text-center'>{day.time}</td>
            <td className='text-center'><MdDelete className='fs-3' onClick={() => handleDelete(day.day,day.time,val._id)} style={{ cursor: 'pointer' }} /></td>
          </tr>
        ))}
    </>
  )
))}            
 </tbody>
                </table>
              </div>
              
            </>
          }
          </div>
          <div className='text-center'>
            <button
              type="submit"
              className="btn btn-primary width"
              onClick={Navigate}
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            >
              Create Schedule
            </button>
          </div>
        </div>
      </div>
      <div style={{ float: 'right' }} className='d-flex gap-2'>
        <button
          type="submit"
          className="btn btn-light mt-2 text-center"
          onClick={() => navigate('/tutor/dashboard/courses')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Back
        </button>
        <button
          type="submit"
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
export default Tutor_coursedetail;
