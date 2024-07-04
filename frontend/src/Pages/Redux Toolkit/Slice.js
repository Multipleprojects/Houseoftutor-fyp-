// counterSlice.js
import { createSlice } from '@reduxjs/toolkit';
// Retrieve the initial state data from local storage if available
const initialState = localStorage.getItem('tutorState')
  ? JSON.parse(localStorage.getItem('tutorState'))
  : {
      loginid: '',
      coursename:'',
      reg_number:'',
      parentcnic:'',

  studentreqdetail:'' ,
  childid:'',
  showDropdown: false, // Add this line
  detailregno:''
  };
const tutorSlice = createSlice({
  name: 'tutor',
  initialState,
  reducers: {
    LoginId(state, action) {
      state.loginid = action.payload;
      // Update the local storage whenever the state changes
      localStorage.setItem('tutorState', JSON.stringify(state));
    },
    Coursename(state, action) {
        state.coursename = action.payload;
        // Update the local storage whenever the state changes
        localStorage.setItem('tutorState', JSON.stringify(state));
      },
  
    Reg_number(state, action) {
      state.reg_number = action.payload;
      // Update the local storage whenever the state changes
      localStorage.setItem('tutorState', JSON.stringify(state));
    },
    Parentcnic(state, action) {
      state.parentcnic = action.payload;
      // Update the local storage whenever the state changes
      localStorage.setItem('tutorState', JSON.stringify(state));
    },
    
    Studentreqdetail(state, action) {
      state.studentreqdetail = action.payload;
      // Update the local storage whenever the state changes
      localStorage.setItem('tutorState', JSON.stringify(state));
    },

    Childid(state, action) {
      state.childid = action.payload;
      // Update the local storage whenever the state changes
      localStorage.setItem('tutorState', JSON.stringify(state));
    },
    setShowDropdown(state, action) { // Add this reducer
      state.showDropdown = action.payload;
    },

    Detailregno(state, action) { // Add this reducer
      state.detailregno = action.payload;
      localStorage.setItem('tutorState', JSON.stringify(state));
    }
  }
});
export const { LoginId, Coursename, Reg_number, Detailregno, Parentcnic, Searchtutor,Studentreqdetail, Childid,setShowDropdown } = tutorSlice.actions;
export default tutorSlice.reducer;
