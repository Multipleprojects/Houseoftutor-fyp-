import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
const Student_coursedetail = () => {
  const navigate = useNavigate();
  const course_detail = useSelector((state) => state.tutor.coursename);
  const loginid = useSelector((state) => state.tutor.loginid);
  const [tutor, getTutor] = useState([]);
  const [courseFound, setCourseFound] = useState(false);
  useEffect(() => {
    const fetchtutordetail = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/tutor`);
        getTutor(response.data);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };
    fetchtutordetail();
  }, []);
  const Navigate = () => {
    navigate('/student/dashboard/learncourse');
  }; 
  let statusText = '';
  let button='';
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  // Filter out tutors based on the status before mapping
  const filteredTutors = tutor.filter(val => val.studentdetail._id === loginid && course_detail.course_title === val.tutordetail.course);
  {filteredTutors.map((val, index) => {
    if (val.status === '1') {
      statusText =(<p className='fw-bold fs-4' style={{color:'rgb(40, 134, 244)'}}>Your request on pending mood</p>);
 button='learn';
    } else if (val.status === '2') {
      if(val.message===true)
        {
   statusText = (<p className='fw-bold fs-4' style={{color:'rgb(40, 134, 244)'}}>Given course learning duration is completed</p>);
  }
  else{
        statusText = (<p className='fw-bold fs-4' style={{color:'rgb(40, 134, 244)'}}>Tutor cancel your request</p>);
    } }
    else if (val.status === '0') {
      button='learn';
      statusText =(
        <>
        <p className='fw-bold fs-4' style={{color:'rgb(40, 134, 244)'}}>Schedule</p>
    <div className='rounded scrollable-schedule' >
       <table className={`table border-default table-hover `}  >
         <thead>
           <tr>
             <th scope="col" className='text-center'>Day</th>
             <th scope="col" className='text-center'>Time</th>
           </tr>
         </thead>
         <tbody>
         {val.tutordetail.schedule.map((schedule, index) => (
<tr className='' key={index}>
   <td className='text-center'>{schedule.day}</td>
   <td className='text-center'>{schedule.time}</td>
 </tr>
))}            
</tbody>
       </table>
     </div>
 </>     
      )
    }
    else if(val.status==='complete')
      {
        statusText = (<p className='fw-bold fs-4' style={{color:'rgb(40, 134, 244)'}}>Given course have complete duration</p>);
  
      }
    else {
      // If status is not defined or empty, return null
      return null;
    }
  })}
  // Check if course details are found for the user
  useEffect(() => {
    const foundCourse = filteredTutors.length > 0;
    setCourseFound(foundCourse);
  }, [filteredTutors]);
  return (
    <div className='course_back p-2'>
      <div className='rounded p-4' style={{ backgroundColor: 'white' }}>
        <div className='d-flex flex-column rounded p-1 pt-4 pb-4' style={{ backgroundColor: 'white' }}>
          <div className='d-flex justify-content-between p-2'>
            <p className='fw-bold'>Course name</p>
            <p>{course_detail.course_title}</p>
          </div>
          <div className='d-flex justify-content-between p-2'>
            <p className='fw-bold'>Grade</p>
            <p>{course_detail.grade}</p>
          </div>
          <p className='p-2'>{statusText}</p>
       </div>
        {/* Display message and button if course details are not found */}
        {button !== 'learn' &&
          <div className='text-center'>
            <button
              type="button"
              className="btn btn-primary mt-2 text-center width"
              onClick={Navigate}
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            >
              Learn
            </button>
        
          </div>
}
      </div>

      <div style={{ float: 'right' }} className='d-flex gap-2'>
        <button
          type="button"
          className="btn btn-light mt-2 text-center"
          onClick={() => navigate('/student/dashboard/courses')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-light mt-2 text-center"
          onClick={() => navigate('/student/dashboard')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};
export default Student_coursedetail;
