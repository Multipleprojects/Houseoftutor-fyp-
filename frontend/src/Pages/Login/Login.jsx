import React, { useEffect, useState } from 'react';
import '../CSS/CSS.css';
import '../CSS/Responsive.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LoginId, Parentcnic } from '../Redux Toolkit/Slice';
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // State used to store input values
  const [Inputvalues, setInputvalues] = useState({
    name: '',
    password: ''
  });
  // Module used to get input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputvalues((prevValues) => ({ ...prevValues, [name]: value }));
  };
  // Module to store input values in the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
     // Convert username to lowercase
     const lowercaseInputValues = {
      ...Inputvalues,
      name: Inputvalues.name.toLowerCase(),
      password:Inputvalues.password
    };
    const response = await axios.post(`${window.location.origin}/login`, lowercaseInputValues); 
    if (response.data.message === 'student dashboard') {
      dispatch(LoginId(response.data.studentId));  
        navigate('/student/dashboard');  
    } else if (response.data.message === 'parent dashboard') {
      navigate('/parent/dashboard');
      dispatch(Parentcnic(response.data.parentcnic));
    } else if (response.data.message === 'admin dashboard') {
      navigate('/admin/dashboard');
    } else if (response.data.message === 'invalid password or username') {
      alert("Invalid password or username");
    }
  };
  return (
    <div>
      <section className="login_center">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid" alt="Sample image" />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form className="mt-lg-5 mt-md-2 mt-sm-0" onSubmit={handleSubmit}>
                <div data-mdb-input-init className="form-outline mb-4 txt-color">
                  <label className="fw-bold fs-2">Login</label><br />
                  <label>Login to your account in seconds</label>
                </div>
                <div data-mdb-input-init className="form-outline mb-4">
                  <input type="text" className="form-control form-control-lg" onChange={handleChange}
                    placeholder="Username" autoComplete="on" name="name" />
                </div>
                <div data-mdb-input-init className="form-outline">
                  <input type="password" className="form-control form-control-lg" autoComplete="on"
                    placeholder="Enter Password" name="password" onChange={handleChange} />
                </div>
                <div className="text-center text-lg-start mt-4 pt-2">
                  <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg w-100"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>     
    </div>
  );
};

export default Login;
