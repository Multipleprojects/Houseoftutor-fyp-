import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Student_request = () => {
  const navigate = useNavigate();
  const loginid = useSelector((state) => state.tutor.loginid);
  const [schedule, setSchedule] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/tutor`);
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };
  const updateStatus = async (tutorId, status) => {
    try {
      const response = await axios.put(`${window.location.origin}/tutor/${tutorId}`, {
        status: status
      });
      if (response.status === 200) {
        if (status === '0') {
          alert("Student request accepted successfully");
        } else if (status === '2') {
          alert("Student request rejected successfully");
        }
        // Filter out items with status 0 or 2 from the schedule
        setSchedule(prevSchedule => prevSchedule.filter(val => val._id !== tutorId));
     fetchData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  let norequest = true;
  
  return (
    <div className='course_back p-2'>
      <div className='scrollable_tutorreq'>
        {schedule &&
          schedule.map((val) => {
            if (val.status === '0' || val.status === '2') {
              return null;
            } else if (loginid === val.tutordetail.studentId) {
              norequest = false;
              return (
                <div key={val._id} className='rounded p-4 mb-2' style={{ backgroundColor: 'white' }}>
                  <div className='d-flex justify-content-between p-1'>
                    <p>Student name</p>
                    <p>{val.studentdetail.name}</p>
                  </div>
                  <div className='d-flex justify-content-between p-1'>
                    <p>Course name</p>
                    <p>{val.tutordetail.course}</p>
                  </div>
                  <div className='d-flex justify-content-between p-1'>
                    <p>Duration</p>
                    <p>{val.duration}</p>
                  </div>
                  <div className='d-flex justify-content-center gap-4'>
                    <button className='btn btn-primary mt-2' onClick={() => updateStatus(val._id, '0')}>
                      Accept
                    </button>
                    <button className='btn btn-primary mt-2' onClick={() => updateStatus(val._id, '2')}>
                      Reject
                    </button>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
        {norequest && <p className='fs-4 fw-bold text-center text-light' >No Student requests found</p>}
        </div> 
      
      <div style={{ float: 'right' }} className='d-flex gap-2'>
        <button
          type='button'
          className='btn btn-light mt-2'
          onClick={() => navigate('/tutor/dashboard')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Dashboard
        </button>
    </div>
    
    </div>
  );
};

export default Student_request;
