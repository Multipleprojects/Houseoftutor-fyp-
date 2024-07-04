import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Search_tutor from './Search_tutor';
import { Coursename } from '../Redux Toolkit/Slice'; // Correct import
import axios from 'axios';
const Student_learn = () => {
  const getCourses = useSelector((state) => state.tutor.coursename);
  const navigate = useNavigate();
  const loginId = useSelector((state) => state.tutor.loginid);
  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();
  const [inputValues, setInputValues] = useState({
    day: '',
    time: ''
  });

  // Fetch Courses and populate dropdown
  const fetchData = async () => {
    try {
      const studentResponse = await axios.get(`${window.location.origin}/studentdetail/${loginId}`);
      const courseResponse = await axios.get(`${window.location.origin}/coursedetail`);
      const studentRegNumber = studentResponse.data.reg_number;
      const filteredCourses = courseResponse.data.filter(course => course.reg_number === studentRegNumber);
      if (filteredCourses.length > 0) {
        const validCourses = filteredCourses[0].detail
          .filter(course =>
            course.course_title &&
            course.course_title.trim() !== '' &&
            (course.grade === 'F' || course.grade === 'Offer' || course.grade === 'D')
          )
          .sort((a, b) => a.course_title.localeCompare(b.course_title));
        setCourses(validCourses);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useEffect call get method modules
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  // Handle course change
  const handleCourseChange = (event) => {
    const selectedCourseTitle = event.target.value;
    const selectedCourse = courses.find(course => course.course_title === selectedCourseTitle);
    dispatch(Coursename(selectedCourse || {}));
  };
  return (
    <div className='course_back p-2'>
      <div className='rounded mb-1' style={{ backgroundColor: 'white' }}>
        <div className='p-2'>
          <div className='schedule_flex'>
            <div className='d-flex gap-2 mt-2'>
              <p>
                <span className='fw-bold text-primary'>Course Title: </span>{getCourses?.course_title || "No course selected"}
              </p>
            </div>
            <div className='schedule_flex'>
              <select onChange={handleCourseChange} className='rounded border border-primary space-dropdown'>
                <option value="">Select a course</option>
                {courses.map((course, index) => (
                  <option key={index} value={course.course_title}>
                    {course.course_title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <Search_tutor />
      <div style={{ float: 'right' }} className='d-flex gap-2'>
        <button
          type='button'
          className='btn btn-light mt-2'
          onClick={() => navigate('/student/dashboard/course/detail')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Back
        </button>
        <button
          type='button'
          className='btn btn-light mt-2'
          onClick={() => navigate('/student/dashboard')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default Student_learn;
