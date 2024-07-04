import React, { useState } from 'react'
import Admin_image from '../Images/admin.png'
import { useNavigate } from 'react-router-dom'
const Admin_dashboard = () => {
const navigate=useNavigate();
//only default value admin have access to add admin btn 
const [Addadmin,setAddadmin]=useState(true)
return (
    <div>
      <img src={Admin_image} alt='error' className='w-100 img_height' />
      <div className='w-100 d-flex flex-column gap-4 justify-content-center align-items-center p-4' style={{marginTop:'5rem'}}>
      <button  class="btn btn-primary btn-lg width" onClick={()=>navigate('/admin/dashboard/uploadfile')}
              style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}>Upload File</button>
            <button  class="btn btn-primary btn-lg width" onClick={()=>navigate('/admin/dashboard/detail')} 
              style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}>View Detail</button>
            <button  class="btn btn-primary btn-lg width" onClick={()=>navigate('/admin/dashboard/passworddetail')} 
              style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}>View Password Detail</button>
                  <button  class="btn btn-primary btn-lg width" onClick={()=>navigate('/login')}
              style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}>Logout</button>
              
              </div>
    </div>
  )
}
export default Admin_dashboard
