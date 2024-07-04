import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { IoCloudUploadOutline } from "react-icons/io5";
const Studentdetail_file = () => {
    const navigate=useNavigate()
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
        setFileName(droppedFile.name);
    };
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };
    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile.name);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file.");
            return;
        }
        // Check if the file has .csv extension
        if (!file.name.endsWith('.xlsx')) {
            alert("Please upload a CSV file only.");
            return;
        }
        // Read file data
        const reader = new FileReader();
        reader.onload = function(event) {
            // Display file data in console
            // console.log(event.target.result);
        };
        reader.readAsText(file);
        // Send file to backend
        const formData = new FormData();
        formData.append('studentfile', file);
        try {
            const response = await axios.post(`${window.location.origin}/studentdetail`, formData);
            alert(response.data); // Log response from the server
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    return (  
        <div className="">
            <form onSubmit={handleSubmit} className='d-flex flex-column gap-2 bord w-100'   onDragOver={handleDragOver} onDrop={handleFileDrop}>
                <div className='text-center'>
                    <IoCloudUploadOutline className=' txt-color mb-2' style={{fontSize:"6rem"}} />
                    <p>{fileName ? `File: ${fileName}` : 'Drag and drop file'}</p>
                </div>
                <p className='txt-color fw-bold fs-4 text-center'>or</p>
                <div className='text-center'>
                <input 
                    type='file' 
                    onChange={handleChange} 
                    accept=".xlsx" 
                    style={{ display: 'none' }} 
                    ref={fileInputRef} 
                    
                />
                <button 
                    type="button" 
                    onClick={handleButtonClick} 
                    className=" bg-white rounded file_btn"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', border:'2px solid rgb(40, 134, 244)', whiteSpace: 'nowrap' }}
                >
                    Upload student detail file
                </button>
                </div>
                <div className='text-center'>
                <button 
                    type="submit"  
                    className="btn btn-primary  mt-5  "
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                >
                    Submit
                </button>
                </div>
            </form>
        </div>
    );
};

export default Studentdetail_file
