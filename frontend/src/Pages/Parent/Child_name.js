import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PiArrowSquareUpRightFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { Childid } from '../Redux Toolkit/Slice';
const Tutor_courses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Parentcnic = useSelector(state => state.tutor.parentcnic);
  const [child,getchild]=useState([]);
  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/studentdetail`);
        const filteredValues = [];

        response.data.map((detail)=>{
            if(detail.fcnic===Parentcnic)
                {
filteredValues.push(detail); 
                }
        })
        getchild(filteredValues);
      } 
      catch (error) {
        console.error("Error fetching student details:", error);
      }
    };
    fetchStudentDetail();
  }, []);
   
  const Navigate = (val) => {
    dispatch(Childid(val._id));
    navigate('/parent/dashboard/child/detail');
  };
  return (
    
    <div className='p-2 course_back '>
      <div className="rounded border p-4 " style={{backgroundColor:'white'}}>
        <div className='scrollable-table'>
          <table className={`table border-default table-hover`}>
            <thead>
              <tr>
                <th scope="col">Child name</th>
                <th scope="col" className='text-center'>Detail</th>
              </tr>
            </thead>
            <tbody>
              {
                child.map((detail) => (
                  <tr >
                    <td>{detail.name}</td>
                    <td className='text-center cursor text-center'>
                      <span onClick={() => Navigate(detail)}>
                        <PiArrowSquareUpRightFill className='fs-3' />
                      </span>
                    </td>
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
          onClick={() => navigate('/parent/dashboard')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
export default Tutor_courses;