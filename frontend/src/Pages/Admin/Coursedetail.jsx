import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Coursename, Reg_number } from '../Redux Toolkit/Slice';
const Coursedetail = () => {
  const Regnumber = useSelector((state) => state.tutor.detailregno); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginId = useSelector(state => state.tutor.loginid);
  const [Coursedetail, setCoursedetail] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [found, setfound] = useState('');

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/coursedetail`);

        let courseFound = false;
        response.data.forEach((val) => {
          if (val.reg_number === Regnumber) {
            courseFound = true;
            // Sort courses by course_title in ascending order
            const sortedCourses = val.detail.sort((a, b) => a.course_title.localeCompare(b.course_title));
            setCoursedetail(sortedCourses);
          }
        });
        if (!courseFound) {
          setfound('Courses not found');
        }
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
    navigate('/tutor/dashboard/course/detail');
  };

  return (
    <div className='p-2 course_back'>
      <div className="rounded border p-4" style={{ backgroundColor: 'white' }}>
        <input
          type='search'
          placeholder='Search by course....'
          className='mb-2 p-2 rounded input_border search_input'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {found ? (
          <div className='text-center text-primary fs-2 fw-bold'>{found}</div>
        ) : (
          <div className='scrollable-table'>
            <table className={`table border-default table-hover`}>
              <thead>
                <tr>
                  <th scope="col">Course name</th>
                  <th scope="col" className='text-center'>Grade</th>
                </tr>
              </thead>
              <tbody>
              {filteredCourses.map((detail) => {
  if (detail.course_title === '' || detail.grade === '') {
    return null;
  }
  return (
    <tr key={detail.course_id}>
      <td>{detail.course_title}</td>
      <td className='text-center'>
        {detail.grade}
      </td>
    </tr>
  );
})}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div style={{ float: 'right' }} className='d-flex gap-2'>
        <button
          type="submit"
          className="btn btn-light mt-2 text-center"
          onClick={() => navigate('/admin/dashboard/detail')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Back
        </button>
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
export default Coursedetail;
