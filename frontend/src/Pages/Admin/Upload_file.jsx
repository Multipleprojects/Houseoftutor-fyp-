import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../CSS/Responsive.css'
import '../CSS/CSS.css'
import {useNavigate} from 'react-router-dom'
import Studentdetail_file from './Studentdetail_file';
import Coursedetail_file from './Coursedetail_file';
const UploadFile = () => {
const navigate=useNavigate()    
    return(
        <div class='container p-4 admin_file'>
        <div class="d-flex flex-lg-row flex-md-row flex-column justify-content-evenly  gap-4">
            <Studentdetail_file />
            <Coursedetail_file />
        </div>
        <div style={{ float: 'right' }} className='btn-margin'>
        <button
          type="submit"
          className="btn btn-light mt-2 text-center" onClick={()=>navigate('/admin/dashboard')}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
        >
          Back
        </button>
        </div>
    </div>
    )
}

export default UploadFile;
