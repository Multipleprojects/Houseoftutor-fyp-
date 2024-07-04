import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PiArrowSquareUpRightFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { Modal, ModalFooter } from 'react-bootstrap';
import { Detailregno } from '../Redux Toolkit/Slice';
const Detail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginId = useSelector(state => state.tutor.loginid);
  const [Studentdetail, setStudentdetail] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
  // Define the order of semesters
  const semesterOrder = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  const fetchStudentDetail = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/studentdetail`);
      // Sort student details by predefined semester order
      const sortedStudentDetails = response.data.sort((a, b) => {
        return semesterOrder.indexOf(a.semester) - semesterOrder.indexOf(b.semester);
      });
      setStudentdetail(sortedStudentDetails);
    } 
    catch (error) {
      console.error("Error fetching student details:", error);
    }
  };
  useEffect(() => {
    fetchStudentDetail();
  }, [loginId]);

  const Navigate = (val) => {
    dispatch(Detailregno(val));
    navigate('/admin/dashboard/coursedetail');
  };
  // Filter student details based on search term
  const filteredStudentDetails = Studentdetail.filter(detail =>
    detail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.reg_number.toLowerCase().includes(searchTerm.toLowerCase())
  );    
  // const handleReschedule = (id, day, time) => {
  //   setRescheduleId(id);
  //   getday(day);
  //   gettime(time);
  //   setShow(true);
  //   setNewDay(day);
  //   setNewTime(time);
  // };

  // const handleUpdate = async () => {
  //   try {
  //     const response = await axios.put(`http://localhost:5000/studentdetail/${rescheduleId}`, {
  //       cgpa: newDay,
  //       semester: newTime
  //     });
  //     alert(response.data);
  //     setShow(false);
  //     setRescheduleId('');
  //     fetchStudentDetail(); // Fetch updated student details
  //   } catch (error) {
  //     alert('Updated schedule already created');
  //   }
  // };
// const handleDelete=async(id)=>{
//   const res=await axios.delete(`http://localhost:5000/studentdetail/${id}`);
//   alert(res.data);
//    // Update state to remove deleted item
//    setStudentdetail(prevDetails => prevDetails.filter(detail => detail._id !== id))
// }
  return (
    <div className='p-2 course_back'>
      <div className="rounded border p-3" style={{ backgroundColor: 'white' }}>
        <input
          type='search'
          placeholder='Search by name or reg number....'
          className='mb-2 p-2 rounded input_border search_input'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className='scrollable-table'>
          <table className={`table border-default table-hover`}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Reg No.</th>
                <th scope="col">CGPA</th>
                <th scope="col">Semester</th>
                <th scope="col" className='text-center'>Detail</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredStudentDetails.map((detail) => (
                  <tr key={detail.course_id}>
                    <td>{detail.name}</td>
                    <td>{detail.reg_number}</td>
                    <td>{detail.cgpa}</td>
                    <td>{detail.semester}</td>
                    <td className='text-center cursor text-center'>
                      <span onClick={() => Navigate(detail.reg_number)}>
                        <PiArrowSquareUpRightFill className='fs-3' />
                      </span>
                    </td>
                    {/* <td>
                      <button
                        type="button"
                        className="btn btn-primary text-center mb-2 widthh"
                        onClick={() => handleReschedule(detail._id, detail.cgpa, detail.semester)}
                      >
                        Reschedule
                      </button>
                    </td>
                   */}
                    {/* <td>
                      <button
                        type="button"
                        className="btn btn-primary text-center mb-2 widthh"
                        onClick={() => handleDelete(detail._id)}
                      >
                        Delete
                      </button>
                    </td> */}
                </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ float: 'right' }}>
        <button
          type="submit"
          className="btn btn-light mt-2 text-center"
          onClick={() => navigate('/admin/dashboard')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Dashboard
        </button>
      </div>
      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update CGPA and Semester</Modal.Title>
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
      </Modal> */}
    </div>
  );
};

export default Detail;
