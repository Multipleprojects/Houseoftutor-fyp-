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
 const [pass,getpass]=useState({
  password:'Mudassir',
  fpassword:'Arshad'
 })
  const handleClose = () => {
    setShow(false);
    setRescheduleId('');
  };
  const fetchStudentDetail = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/studentdetail`);
      // Sort student details by predefined semester order
      setStudentdetail(response.data);
    } 
    catch (error) {
      console.error("Error fetching student details:", error);
    }
  };
  //update password and fpassword
//  const Password=async(id)=>{
//   try{
//   const response=await axios.put(`http://localhost:5000/studentdetail/${id}`,pass);
// alert(response.data)
//  // Update the state with the new details
//  setStudentdetail(prevDetails => 
//   prevDetails.map(detail => 
//     detail._id === id ? { ...detail, ...pass } : detail
//   )
// )
//   }
//   catch(err)
//   {
//     console.log("error occure")
//   }
// }

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
    detail.fname.toLowerCase().includes(searchTerm.toLowerCase())
  );    
  return (
    <div className='p-2 course_back'>
      <div className="rounded border p-3" style={{ backgroundColor: 'white' }}>
        <input
          type='search'
          placeholder='Search by username or fatherusername....'
          className='mb-2 p-2 rounded input_border search_input'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className='scrollable-table'>
          <table className={`table border-default table-hover`}>
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Father Username</th>
                <th scope="col" className='text-center'>Password</th>
                <th scope="col" className='text-center'>Father password</th>
{/* <th>Update data</th> */}
              </tr>
            </thead>
            <tbody>
              {
                filteredStudentDetails.map((detail) => (
                  <tr key={detail.course_id}>
                    <td>{detail.name}</td>
                    <td>{detail.fname}</td>
                    <td className='text-center'>{detail.password}</td>
                    <td className='text-center'>{detail.fpassword}</td>
                {/* <td onClick={()=>Password(detail._id)}>Update</td> */}
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
    </div>
  );
};
export default Detail;
