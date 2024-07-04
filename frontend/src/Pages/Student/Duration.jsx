import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Duration = () => {
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const requestDetail = useSelector((state) => state.tutor.studentreqdetail);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const inputDate = new Date(duration);
    const now = new Date();
//   now.setHours(0, 0, 0, 0); // Reset the time to midnight to compare dates only
    if (inputDate < now) {
      setError('The date and time must be in the future.');
      return;
    }
    try {
      const response = await axios.post(`${window.location.origin}/tutor`, {
        tutordetail: requestDetail.tutordetail,
        studentdetail: requestDetail.studentloginid,
        duration: duration
      });
      alert(response.data.message);
      // Perform PUT request to update status
     if (response.data.id || response.data.message === 'Tutor details updated successfully') {
        const updateResponse = await axios.put(`${window.location.origin}/tutor/${response.data.id}`, {
          status: '1',
        });
      }
      navigate('/student/dashboard/course/detail')
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };
  return (
    <div className='p-2'>
      <div className='rounded p-4' style={{ backgroundColor: 'white' }}>
        <div className='d-flex flex-column rounded p-1 pt-4 pb-4' style={{ backgroundColor: 'white' }}>
          <form onSubmit={handleSubmit}>
            <div className='p-2'>
              <input
              required
                type='datetime-local'
              // type='date' 
               placeholder='YYYY-MM-DDTHH:MM'
                className='mb-2 p-2 rounded input_border'
                style={{ width: '88%' }}
                onChange={(e) => { setDuration(e.target.value); setError(''); }}
              />
              {error && <p style={{ color: 'rgb(40, 134, 244)' }}>{error}</p>}
            </div>
            <div className='text-center mt-4'>
              <button
                type="submit"
                className="btn btn-primary mt-2 text-center width"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
>
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Duration;
