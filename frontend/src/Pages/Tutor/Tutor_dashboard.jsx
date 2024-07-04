import React, { useState } from 'react';
import tutor_image from '../Images/tutor.png';
import { Navigate, useNavigate } from 'react-router-dom';
import { FaArrowCircleRight } from 'react-icons/fa';
import '../CSS/Responsive.css'
import {useSelector} from 'react-redux'
import axios from 'axios';
const Tutor_dashboard = () => {
  const loginId=useSelector((state)=>state.tutor.loginid);
  const [duration,setduration]=useState(null);
  const navigate = useNavigate();
  const Navigate=async()=>{
    
        try {
            const response = await axios.put(`${window.location.origin}/tutor/updateduration/${loginId}`, { duration});
            console.log(response.data.message)
        } catch (error) {
            console.log(error.response?.data?.message || "An error occurred");
        } 
        navigate('/tutor/dashboard/studentrequest');
      }
  return (
    <div className=''>    
      <img src={tutor_image} alt='error' style={{ width: '100%' }} className='img_height' />
      <div className=''>
      <div style={{ float: 'right' }}>
        <p className='txt-color fw-bold p-3 fs-5 cursor' onClick={() => navigate('/student/dashboard')}>
          Switch student <span><FaArrowCircleRight className='fs-2 ' style={{ marginLeft: '0.3rem' }} /></span>
        </p>
      </div>
      <div className='scrollable w-100'>
      <div className='d-flex flex-column gap-4 justify-content-center align-items-center' style={{ marginTop: '1px'}}>
        <button className="btn btn-primary btn-lg width" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} onClick={() => navigate('/tutor/dashboard/courses')}>Courses</button>
        <button className="btn btn-primary btn-lg width" onClick={() => navigate('/tutor/dashboard/classtoday')} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Classes today</button>
        <button className="btn btn-primary btn-lg width" onClick={() => navigate('/tutor/dashboard/courseinprogress')} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Courses in progress</button>
        <button className="btn btn-primary btn-lg width" onClick={Navigate} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Student requests</button>
        <button className="btn btn-primary btn-lg width mb-4" onClick={() => navigate('/login')} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Logout</button>
        </div>        
      </div>
      </div>
      </div>
  );
};
export default Tutor_dashboard;
