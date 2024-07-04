import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Child_detail = () => {
  const navigate = useNavigate();
  const childid = useSelector((state) => state.tutor.childid);
  const [schedule, setSchedule] = useState([]);
  const [isempty, setIsEmpty] = useState(true);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/tutor`);
      const filtereddata = response.data.filter(detail => detail && detail.studentdetail._id === childid && detail.status === '0');
      setSchedule(filtereddata);
      setIsEmpty(filtereddata.length === 0);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='course_back p-2 '>
      <div className='scrollable_tutorreq'>
        {schedule.map((val) => (
          <div className='p-4 rounded m-2' style={{backgroundColor:'white'}} key={val._id}>
            <div className='d-flex justify-content-between'>
              <p>Course name</p>
              <p>{val.tutordetail.course}</p>
            </div>
            <div className='d-flex justify-content-between'>
              <p>Held classes</p>
              <p>{val.tutordetail.status[0].attendence}</p>
            </div>
            <div className='d-flex justify-content-between'>
              <p>Cancel classes</p>
              <p>{val.tutordetail.status[0].cancel}</p>
            </div>
            <div className='d-flex justify-content-between'>
              <p>Fee</p>
              <p>2500</p>
            </div>
            <div className='text-center'>
            </div>
          </div>
        ))}
        {isempty && <p className='fs-4 fw-bold text-center text-light'>detail not found</p>}
      </div>
      <div style={{ float: 'right' }} className='d-flex gap-2'>
        <button
          type='button'
          className='btn btn-light mt-2'
          onClick={() => navigate('/parent/dashboard/childname')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Back
        </button>
        <button
          type='button'
          className='btn btn-light mt-2'
          onClick={() => navigate('/parent/dashboard')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default Child_detail;
