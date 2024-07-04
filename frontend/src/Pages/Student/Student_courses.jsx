import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PiArrowSquareUpRightFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { Coursename, Reg_number } from '../Redux Toolkit/Slice';
const Student_courses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginId = useSelector(state => state.tutor.loginid);
  const [Studentdetail, setStudentdetail] = useState([]);
  const [Coursedetail, setCoursedetail] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [Regnumber,getRegnumber]=useState('');
  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/studentdetail/${loginId}`);
        setStudentdetail(response.data);
        getRegnumber(()=>response.data.reg_number);
      } 
      catch (error) {
        console.error("Error fetching student details:", error);
      }
    };
    fetchStudentDetail();
  }, [loginId]);
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/coursedetail`);
        response.data.map((val)=>{
          if(val.reg_number===Regnumber)
            {
              // Sort courses by course_title in ascending order
              const sortedCourses = val.detail.sort((a, b) => a.course_title.localeCompare(b.course_title));
              setCoursedetail(sortedCourses);
            }
        })
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    fetchCourseDetail();
  }, [Regnumber]);
  // Function to filter courses based on search term
  const filteredCourses = Coursedetail.filter(course =>
    course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const Navigate = (val) => {
    dispatch(Coursename(val));
    dispatch(Reg_number(Regnumber));
    navigate('/student/dashboard/course/detail');
  };
  return (
    <div className='p-2 course_back'>
      <div className="rounded border p-3 " style={{backgroundColor:'white'}}>
        <input
          type='search'
          placeholder='Search by course....'
          className='mb-2  p-2 rounded input_border search_input'
          value={searchTerm}
         
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className='scrollable-table'>
          <table className={`table border-default table-hover`}>
            <thead>
              <tr>
                <th scope="col">Course name</th>
                <th scope="col" className='text-center'>Detail</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredCourses.map((detail) => 
                  {
                    if(detail.course_title==='')
                      {
                        return null;
                      }
                      if(detail.grade==='Offer' || detail.grade==='F' || detail.grade==='D'){
                  return(
                  <tr key={detail.course_id}>
                    <td>{detail.course_title}</td>
                    <td className='text-center cursor text-center'>
                      <span onClick={() => Navigate(detail)}>
                        <PiArrowSquareUpRightFill className='fs-3' />
                      </span>
                    </td>
                  </tr>
                )}})
              }
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ float: 'right' }}>
        <button
          type="submit"
          className="btn btn-light mt-2 text-center"
          onClick={() => navigate('/student/dashboard')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
export default Student_courses;