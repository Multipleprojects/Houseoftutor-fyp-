import React, { useState, useEffect } from 'react';
import student_image from '../Images/student.png';
import { useNavigate } from 'react-router-dom';
import { FaArrowCircleRight } from "react-icons/fa";
import { useSelector } from 'react-redux';
import axios from 'axios';
const Student_dashboard = () => {
  const Loginid = useSelector((state) => state.tutor.loginid);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [rating,setRating]=useState()
  const navigate = useNavigate();   
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/tutor`);
        const fetchedTutors = response.data;
        if (fetchedTutors.length === 0) {
          console.log("No tutor data found.");
          return; // Exit the useEffect early
        }
        fetchedTutors.forEach((val) => {
          if (val.studentdetail._id === Loginid && val.status === '0') {
            const currentDateTime = new Date();
            const formattedCurrentDateTime = currentDateTime.toISOString();
            if (formattedCurrentDateTime >= val.duration) {
              setShowDropdown(true);
              setSelectedTutor(val);
              console.log("student giving Rating working well");
            } else {
              console.log("No durations are complete yet.");
            }
          }
        });
      } catch (error) {
        console.error("Error fetching tutor data:", error);
      }
    };
    fetchData();
  }, [Loginid]);
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const submitRating = async () => {
  try {
    const response = await axios.put(`${window.location.origin}/tutor/durationcomplete/${Loginid}`, { rating });
    if (response.status === 200) {
      alert("Rating submitted successfully");
      setShowDropdown(false);
    }
  } catch (error) {
    console.error("Error submitting rating:", error);
  }
};
return (
    <div>
      <img src={student_image} alt='error' style={{ width: '100%' }} className='img_height' />
      <div style={{ float: 'right' }}>
        <p className='txt-color fw-bold p-3 fs-5 cursor' onClick={() => navigate('/tutor/dashboard')}>Switch tutor <span><FaArrowCircleRight className='fs-2' style={{ marginLeft: '0.3rem' }} /></span></p>
      </div>
      <div className='w-100 d-flex flex-column gap-5 justify-content-center align-items-center ' style={{ marginTop: '5rem' }}>
        <button className="btn btn-primary btn-lg width" onClick={() => navigate('/student/dashboard/courses')} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Courses</button>
        <button className="btn btn-primary btn-lg width" onClick={() => navigate('/student/dashboard/todayclass')} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Classes today</button>
        <button className="btn btn-primary btn-lg width" onClick={() => navigate('/student/dashboard/coursesinprogress')} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Courses in progress</button>
        <button className="btn btn-primary btn-lg width" onClick={() => navigate('/login')} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Logout</button>
        {/* <button className="btn btn-primary btn-lg width" onClick={Checkduration} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Check Duration</button>     
    */} 
     </div> 
     {showDropdown && (
        <div className="modal fade show" id="ratingModal" tabIndex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="ratingModalLabel">Submit Rating</h5>
                 </div>
              <div className="modal-body">
                <select  className="form-select" onChange={handleRatingChange}>
                  {[1, 2, 3, 4, 5].map((rate) => (
                    <option key={rate} value={rate}>{rate}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={submitRating} >Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Student_dashboard;