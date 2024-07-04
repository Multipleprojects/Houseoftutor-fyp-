import React from 'react'
import Login from '../Login/Login';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Student_dashboard from '../Student/Student_dashboard'
import Tutor_dashboard from '../Tutor/Tutor_dashboard';
import Parent_dashboard from '../Parent/Parent_dashboard'
import Admin_dashboard from '../Admin/Admin_dashboard';
import Upload_file from '../Admin/Upload_file';
import Tutor_courses from '../Tutor/Tutor_courses';
import Tutor_coursedetail from '../Tutor/Tutor_coursedetail';
import Tutor_schedule from '../Tutor/Tutor_schedule';
import Student_courses from '../Student/Student_courses';
import Student_coursedetail from '../Student/Student_coursedetail';
import Tutor_classestoday from '../Tutor/Tutor_classestoday';
import Tutor_classesinprogress from '../Tutor/Tutor_classesinprogress';
import Student_learn from '../Student/Student_learn';
import Search_tutor from '../Student/Search_tutor';
import Student_request from '../Tutor/Student_request'
import Child_name from '../Parent/Child_name';
import Duration from '../Student/Duration';
import Student_courseinprogress from '../Student/Student_courseinprogress';
import Student_Todayclass from '../Student/Student_todayclass';
import Child_detail from '../Parent/Child_detail';
import Detail from '../Admin/Detail';
import Coursedetail from '../Admin/Coursedetail';
import Passworddetail from '../Admin/Passworddetail';
const Navigate = () => {
  return (
    <div>
<Router>
  <Routes>
 /* Login */
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    /* Admin */
    <Route path="/admin/dashboard" element={<Admin_dashboard />} />
    <Route path='/admin/dashboard/uploadfile' element={<Upload_file />} />
<Route path='/admin/dashboard/detail' element={<Detail />} />
<Route path='/admin/dashboard/passworddetail' element={<Passworddetail />} />
<Route path='/admin/dashboard/coursedetail' element={<Coursedetail />} />
    /* Student */
    <Route path="/student/dashboard" element={<Student_dashboard />} />
    <Route path="/student/dashboard/courses" element={<Student_courses />} />
    <Route path="/student/dashboard/course/detail" element={<Student_coursedetail />} />
    <Route path="/student/dashboard/learncourse" element={<Student_learn />} />
    <Route path="/student/dashboard/searchtutor" element={<Search_tutor />} />
    <Route path="/student/dashboard/course/duration" element={<Duration />} />
    <Route path="/student/dashboard/coursesinprogress" element={<Student_courseinprogress />} />
    <Route path="/student/dashboard/todayclass" element={<Student_Todayclass />} />
    
    /* Tutor */
    <Route path="/tutor/dashboard" element={<Tutor_dashboard />} />
    <Route path="/tutor/dashboard/courses" element={<Tutor_courses />} />
    <Route path="/tutor/dashboard/course/detail" element={<Tutor_coursedetail />} />
    <Route path="/tutor/dashboard/course/schedule" element={<Tutor_schedule />} />
    <Route path="/tutor/dashboard/classtoday" element={<Tutor_classestoday />} />
    <Route path="/tutor/dashboard/courseinprogress" element={<Tutor_classesinprogress />} />
    <Route path="/tutor/dashboard/studentrequest" element={<Student_request />} />
    
    /* Parent */
    <Route path="/parent/dashboard" element={<Parent_dashboard />} />
    <Route path="/parent/dashboard/childname" element={<Child_name />} />
 <Route path='/parent/dashboard/child/detail' element={<Child_detail />} />
  </Routes>
</Router>
    </div>
  )
}
export default Navigate