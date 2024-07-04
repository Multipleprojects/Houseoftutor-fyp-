import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Studentreqdetail } from '../Redux Toolkit/Slice';
import Duration from '../Student/Duration';

const Search_tutor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginid = useSelector((state) => state.tutor.loginid);
    const coursename = useSelector((state) => state.tutor.coursename.course_title);
    const [show, setShow] = useState(false);
    const [showduration, setShowduration] = useState(false);
    const [Tutorschedule, setTutorschedule] = useState('');
    const [Tutor, setTutor] = useState([]);
    const handleClose = () => setShow(false);
    const handleClosee = () => setShowduration(false);

    // Function to fetch data
    const fetchdata = async () => {
        try {
            const responseschedule = await axios.get(`${window.location.origin}/schedule`);
            const responsetutor = await axios.get(`${window.location.origin}/tutor`);
            const tutor = responsetutor.data;
            const schedule = responseschedule.data;
            const filteredSchedule = schedule.filter(sch => sch.course === coursename);

            // Merge tutor and schedule data based on your criteria
            const mergedData = filteredSchedule.map(sch => {
                const tut = tutor.find(tut => tut.tutordetail._id === sch._id);
                if (tut && tut.status === '2' && tut.tutordetail.course === coursename) {
                    return { ...sch, tutor: tut };
                }
                return sch;
            });

            setTutor(mergedData);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchdata();
    }, [coursename]);

    const handleNavigate = (val) => {
        dispatch(Studentreqdetail({ tutordetail: val, studentloginid: loginid }));
        setShowduration(true);
    };

    const handleTutorSchedule = (val) => {
        setShow(true);
        setTutorschedule(val);
    };

    const displayedTutors = new Set();
    const sortedTutors = [...Tutor].sort((a, b) => b.rating - a.rating);
    const noScheduleFound = sortedTutors.length === 0;

    return (
        <div className="">
            <div className="scrollable_search_tutor">
                {sortedTutors.map((val) => {
                    if (val.studentId && val.studentId._id !== loginid && !displayedTutors.has(val.studentId._id)) {
                        displayedTutors.add(val.studentId._id);
                        return (
                            <div key={val.studentId._id} className="rounded p-4 mb-2" style={{ backgroundColor: 'white' }}>
                                <div className="d-flex justify-content-between">
                                    <p>Name</p>
                                    <p>{val.studentId.name}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p>Grade</p>
                                    <p>{val.grade}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p>Rating</p>
                                    <p>{val.rating}</p>
                                </div>
                                <div className="d-flex gap-2 justify-content-center align-content-center">
                                    <button
                                        type="button"
                                        className="btn btn-primary mt-3 text-center"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                        onClick={() => handleTutorSchedule(val.schedule)}
                                    >
                                        Course schedule
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary mt-3 text-center"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                        onClick={() => handleNavigate(val)}
                                    >
                                        Send request
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
                {noScheduleFound && <p className="fs-4 fw-bold text-center text-light">Schedule not found</p>}
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Schedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Tutorschedule && Tutorschedule.map((val, index) => (
                        <div key={index} className="d-flex justify-content-between">
                            <p>{val.day}</p>
                            <p>{val.time}</p>
                        </div>
                    ))}
                </Modal.Body>
            </Modal>
            <Modal show={showduration} onHide={handleClosee}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <p className="fw-bold fs-3 text-primary">Give Course Duration</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Duration />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Search_tutor;
