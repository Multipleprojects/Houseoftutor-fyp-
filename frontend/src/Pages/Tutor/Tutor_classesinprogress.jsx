import axios from 'axios'; // Importing axios for making HTTP requests
import React, { useEffect, useState } from 'react'; // Importing React hooks
import { useSelector } from 'react-redux'; // Importing useSelector hook from react-redux
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom
import { Modal, ModalFooter } from 'react-bootstrap';
const Tutor_classesinprogress = () => {
  const loginId=useSelector((state)=>state.tutor.loginid);
  const navigate = useNavigate(); // Initializing the navigate function using useNavigate
  const [schedule, setSchedule] = useState([]);
  const weekdayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  // useEffect hook to fetch data when component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/schedule`);
        const responsetutor=await axios.get(`${window.location.origin}/tutor`)
        const filteredValues = [];
        response.data.forEach((val) => {
          responsetutor.data.forEach((tutor) => {
               if (tutor.tutordetail.studentId === loginId && val.studentId._id===loginId) {
                   if (tutor.status === '0' && tutor.tutordetail.course===val.course) {
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
    const handleReschedule = (id, day, time) => {
      setRescheduleId(id);
      getday(day);
      gettime(time);
      setShow(true);
      setNewDay(day);
      setNewTime(time);
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
  return (
    <div className='course_back p-2'>
      <div className='rounded border border-light p-4 ' style={{backgroundColor:'white'}}>     
        <div className='scrollable-course'>
          <table className='table border-default table-hover'>
            <thead>
              <tr>
                <th scope="col" className='text-center'>Course</th>
                <th scope="col" className='text-center'>Day</th>
                <th scope="col" className='text-center'>Time</th>
      <th scope='col' className='text-center'>Update</th>
              </tr>
            </thead>
            <tbody>
  {schedule && schedule.map((entry, index) => (
    entry.schedule
      // Sort classItem array by day using weekdayOrder
      .sort((a, b) => weekdayOrder.indexOf(a.day) - weekdayOrder.indexOf(b.day))
      .map((classItem, innerIndex) => (
        <tr key={index + innerIndex}>
          {innerIndex === 0 && ( // Display course only once
            <td className='text-center' rowSpan={entry.schedule.length}>
              {entry.course}
            </td>
          )}
          <td className='text-center'>{classItem.day}</td>
          <td className='text-center'>{classItem.time}</td>
        <td className='text-center'>{!rescheduleId && (
                          <button
                            type="button"
                            className="btn btn-primary text-center mb-2 widthh"
                            onClick={() => handleReschedule(entry._id, classItem.day, classItem.time)}
                          >
                            Reschedule
                          </button>
                        )}</td>
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
export default Tutor_classesinprogress;
