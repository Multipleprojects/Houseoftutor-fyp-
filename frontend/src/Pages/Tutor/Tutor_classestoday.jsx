import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalFooter } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
const Tutor_classestoday = () => {
  const navigate = useNavigate();
  const [Schedule, setSchedule] = useState([]);
  const [rescheduleId, setRescheduleId] = useState('');
  const [day, getday] = useState('');
  const [time, gettime] = useState('');
  const [newDay, setNewDay] = useState(day);
  const [newTime, setNewTime] = useState(time);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setRescheduleId('');
  };
  const loginId = useSelector((state) => state.tutor.loginid);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/schedule`);
      const responsetutor = await axios.get(`${window.location.origin}/tutor`);
      const filteredValues = [];
      response.data.forEach((val) => {
        responsetutor.data.forEach((tutor) => {
          if (tutor.tutordetail.studentId === loginId && val.studentId._id === loginId) {
            if (tutor.status === '0' && tutor.tutordetail.course === val.course) {
              filteredValues.push(val);
            }
          }
        });
      });
      setSchedule(filteredValues); // Update state with filtered values
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleReschedule = (id, day, time) => {
    setRescheduleId(id);
    getday(day);
    gettime(time);
    setShow(true);
    setNewDay(day);
    setNewTime(time);
  };
  const updateStatus = async (id, action) => {
    try {
      const response = await axios.put(`${window.location.origin}/schedule/${id}`, { action });
      alert(response.data.message);
    } catch (error) {
      alert(`Error updating ${action} status: ${error.response ? error.response.data.message : error.message}`);
    }
  };
  const dayvalidation = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timevalidate = [
    '9:00am to 10:00am', '10:00am to 11:00am', '11:00am to 12:00pm',
    '12:00pm to 1:00pm', '1:00pm to 2:00pm', '2:00pm to 3:00pm', '3:00pm to 4:00pm'
  ];
  const handleUpdate = async () => {
    try {
      if (!dayvalidation.includes(newDay)) {
        alert("Invalid day selection");
      } else if (!timevalidate.includes(newTime)) {
        alert("Invalid time selection");
      } else {
        const response = await axios.put(`${window.location.origin}/schedule/${rescheduleId}/${day}/${time}`, {
          newDay: newDay,
          newTime: newTime
        });
        alert(response.data.message);
        setShow(false);
        setRescheduleId('');
        fetchData();
      }
    } catch (error) {
      alert('Updated schedule already created');
    }
  };
  const currentDate = new Date();
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = daysOfWeek[currentDate.getDay()];
  return (
    <div className='course_back p-2'>
      <div className='rounded p-4 ' style={{ backgroundColor: 'white' }}>
        <div className='scrollable-course'>
          <table className='table border-default'>
            <thead>
              <tr>
                <th scope="col" className='text-center'>Course</th>
                <th scope="col" className='text-center'>Day</th>
                <th scope="col" className='text-center'>Time</th>
                <th scope="col" className='text-center'></th>
              </tr>
            </thead>
            <tbody>
              {Schedule && Schedule.map((value) => {
                const todaySchedule = value.schedule.filter((detail) => detail.day.toLowerCase() === currentDay.toLocaleLowerCase());
                return todaySchedule.map((detail, index) => (
                  <tr key={index} className='flex'>
                    <td className='text-center'>{value.course}</td>
                    <td className='text-center'>{detail.day}</td>
                    <td className='text-center'>{detail.time}</td>
                    <td className='text-center'>
                      <div className='d-flex flex-wrap justify-content-center gap-4 flex-wrap-buttons'>
                        {!rescheduleId && (
                          <button
                            type="button"
                            className="btn btn-primary text-center mb-2 widthh"
                            onClick={() => handleReschedule(value._id, detail.day, detail.time)}
                          >
                            Reschedule
                          </button>
                        )} 
                            <button
                              type="button"
                              className="btn btn-primary text-center mb-2 widthh"
                              onClick={() => updateStatus(value._id, 'held')}
                            >
                              Held
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary text-center mb-2 widthh"
                              onClick={() => updateStatus(value._id, 'cancel')}
                            >
                              Cancel
                            </button>
                        </div>
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ float: 'right' }} className='d-flex gap-2 mt-2'>
        <button
          type="button"
          className="btn btn-light text-center"
          onClick={() => navigate('/tutor/dashboard')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Dashboard
        </button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Day and Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex flex-column gap-4 '>
            <input
              type="text"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className='rounded p-1 border border-primary'
            />
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className='rounded p-1 border border-primary'
            />
          </div>
        </Modal.Body>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-primary text-center"
            onClick={handleUpdate}
          >
            Update
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default Tutor_classestoday;


