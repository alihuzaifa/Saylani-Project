import React, { useState, useEffect } from 'react';
import AdminPanel from './AdminPanel';
import swal from 'sweetalert';
import img from "../image/person.gif"
import { db, storage } from "../Config/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, where } from "firebase/firestore";

const AddCourse = () => {

    const [courseName, setCourseName] = useState("");
    const [courseDuration, setCourseDuration] = useState("");
    const [eligibility, setEligibility] = useState("");
    const [lastDate, setLastDate] = useState("");
    const [location, setLocation] = useState("");
    const [coursePicture, setCoursePicture] = useState(null);
    const [click, setClick] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [modalName, setModalName] = useState("");
    const [duration, setDuration] = useState("");
    const [modalEligible, setModalEligible] = useState("");
    const [modalDate, setModalDate] = useState("");
    const [modalLocation, setModalLocation] = useState("");
    const [modalPicture, setModalPicture] = useState(img);
    const [changeModalPic, setChangeModalPic] = useState(null);
    const [docId, setDocId] = useState("")


    // Create Class
    const makeCourse = async () => {
        if (courseName !== "" && courseDuration !== "" && eligibility !== "" && lastDate !== "" && location !== "" && coursePicture !== null) {
            let imageRef = coursePicture.name
            let storageRef = ref(storage, `images/course-picture/${imageRef}`);
            try {
                setClick(true)
                await uploadBytes(storageRef, coursePicture);
                let url = await getDownloadURL(storageRef)
                await addDoc(collection(db, "courses"), {
                    name: courseName, courseDuration: courseDuration, eligible: eligibility,
                    lastEnrollDate: lastDate, courseLocation: location, picture: url,
                    time: new Date().getTime()
                });
                swal("Successful", "The Class Has Been Created", "success");
                setClick(false);
                setCourseName("");
                setCourseDuration("")
                setEligibility("");
                setLastDate("");
                setLocation("");
            } catch (e) {
                console.log(e)
            }
        } else {
            swal({
                title: "Missing!",
                text: "All Data is Required",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
        }
    }

    // Get Class Data And Show On Screen
    const fetchData = async () => {
        let collectionRef = collection(db, "courses")
        const q = query(collectionRef);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const certificates = [];
            querySnapshot.forEach((doc) => {
                certificates.push({ ...doc.data(), id: doc.id });
            });
            setDocuments(certificates)
        });
        return () => unsubscribe()
    }
    useEffect(() => {
        fetchData()
    }, [])

    // For Deleting
    const deleteCourse = async (id, time) => {
        await deleteDoc(doc(db, "courses", id));
        documents.filter((currentEl, index) => {
            return (
                currentEl?.time !== time
            )
        })
    }

    // For Editing
    const editCourse = (id, time) => {
        let collectionRef = collection(db, "courses")
        let CollectionQuery = where("time", "==", time)
        const q = query(collectionRef, CollectionQuery);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                setModalName(data.name);
                setModalEligible(data.eligible);
                setDuration(data.courseDuration);
                setModalDate(data.lastEnrollDate);
                setModalLocation(data.courseLocation);
                setModalPicture(data.picture)
            });
            setDocId(id);
        });
        return () => unsubscribe()
    }

    const saveData = async () => {
        if (modalName !== "" && modalEligible !== "" && duration !== "" && modalDate !== "" && modalLocation !== "") {
            const collectionRef = doc(db, "courses", docId);
            if (changeModalPic !== null) {
                let imageRef = changeModalPic.name
                let storageRef = ref(storage, `images/courses/${imageRef}`);
                try {
                    setClick(true)
                    let data = await uploadBytes(storageRef, changeModalPic);
                    console.log(data)
                    let url = await getDownloadURL(storageRef);
                    console.log(url)
                    await updateDoc(collectionRef, {
                        name: modalName, eligible: modalEligible, lastEnrollDate: modalDate, courseDuration: duration, courseLocation: modalLocation, picture: url, time: new Date().getTime()
                    })
                    setModalName("");
                    setDuration("");
                    setModalEligible("");
                    setModalDate("");
                    setModalLocation("");
                    setModalPicture(img);
                    setChangeModalPic(null);
                    swal("Updated", "Your data has updated", "success");
                }
                catch (e) {
                    console.log(e)
                    setClick(false)
                }
                setClick(false)

            } else {
                setClick(true);

                try {
                    await updateDoc(collectionRef, {
                        name: modalName, eligible: modalEligible, lastEnrollDate: modalDate, courseDuration: duration, courseLocation: modalLocation, time: new Date().getTime()
                    });
                    swal("Updated", "Your data has updated", "success");
                } catch (e) {
                    console.log(e);
                    setClick(false)
                }

                setClick(false)
            }
        }
        else {
            swal({
                title: "Unsaved",
                text: "Some data are missing.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
        }
    }

    return (
        <>
            <AdminPanel />
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Courses Details:</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="modal-image mb-3 text-center">
                                <img src={modalPicture} alt="modal-imagee" className='modal-picture' onChange={(e) => { setModalPicture(e.target.files) }} />
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="abcd" value={modalName} onChange={(e) => { setModalName(e.target.value) }} />
                                <label htmlFor="floatingInput">Course Name:</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="abcd" value={modalLocation} onChange={(e) => { setModalLocation(e.target.value) }} />
                                <label htmlFor="floatingInput">Location:</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="abcd" value={duration} onChange={(e) => { setDuration(e.target.value) }} />
                                <label htmlFor="floatingInput">Course:</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="abcd" value={modalEligible} onChange={(e) => { setModalEligible(e.target.value) }} />
                                <label htmlFor="floatingInput">Section:</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="date" className="form-control" id="floatingInput" placeholder="abcd" value={modalDate} onChange={(e) => { setModalDate(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <input className="form-control" type="file" files={changeModalPic} id="formFileMultiple" onChange={(e) => { setChangeModalPic(e.target.files[0]) }} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" disabled={click} onClick={saveData}> {
                                click ?
                                    <div className="spinner-border"></div>
                                    : "Save Changes"
                            }</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="conatainer my-4">
                <div className="row">
                    <div className="col offset-0 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                        <div className="card pt-2 pb-3 px-4">
                            <div>
                                <div className="head-news text-center mb-3 mt-3">
                                    <span className='bg-dark h5 text-white p-2 rounded'>New Course</span>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control student-name" id="floatingInput" placeholder="web-development" value={courseName}
                                        onChange={(e) => { setCourseName(e.target.value) }} />
                                    <label htmlFor="floatingInput" className='text-center'>Course Name:</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control student-name" id="floatingInput" placeholder="6-months" value={courseDuration} onChange={(e) => { setCourseDuration(e.target.value) }} />
                                    <label htmlFor="floatingInput" className='text-center'>Course Duration:</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control student-name" id="floatingInput" placeholder="criteria" value={eligibility}
                                        onChange={(e) => { setEligibility(e.target.value) }} />
                                    <label htmlFor="floatingInput" className='text-center'>Course Eligibility Criteria:</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control student-name" id="floatingInput" placeholder="criteria" value={location}
                                        onChange={(e) => { setLocation(e.target.value) }} />
                                    <label htmlFor="floatingInput" className='text-center'>Location:</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="date" className="form-control student-name" id="floatingInput" placeholder="2-feb" value={lastDate} onChange={(e) => { setLastDate(e.target.value) }} />
                                </div>
                                <div>
                                    <input className="form-control form-control-lg" id="formFileLg" type="file" onChange={(e) => { setCoursePicture(e.target.files[0]) }} />
                                </div>
                                <div className="mt-4 mb-1 text-center">
                                    {
                                        click
                                            ? <button className="save-news" onClick={makeCourse} disabled={click}><div className="spinner-border"></div></button>
                                            : <button className="save-news" onClick={makeCourse}>Make</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                documents.length > 0 ?
                    <div className="container">
                        <div className="row">
                            <div className="col h2 text-center fw-bold text-decoration-underline">
                                All Courses
                            </div>
                        </div>
                    </div>
                    : null
            }
            <section id="team" className="pb-5">
                <div className="container">
                    <div className="row">
                        {
                            documents.length > 0 ?
                                documents.map((currentEl, index) => {
                                    return (
                                        <div className="col-12 offset-0 col-sm-10 offset-sm-1 col-md-6 offset-md-0 col-lg-4" key={index}>
                                            <div className="image-flip">
                                                <div className="mainflip flip-0">
                                                    <div className="frontside">
                                                        <div className="card">
                                                            <div className="card-body text-center">
                                                                <p><img src={currentEl.picture} className="img-fluid" alt="card-imag" /></p>
                                                                <h4 className="card-title">{currentEl.name}</h4>
                                                                <p className="card-text">Saylani Mass It Training.</p>
                                                                <h5 className="card-text text-success">Duration: {currentEl.courseDuration}</h5>
                                                                <h4 className="card-title">Last Enrollment</h4>
                                                                <p className="card-text">{currentEl.lastEnrollDate}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="backside">
                                                        <div className="card">
                                                            <div className="card-body text-center mt-4">
                                                                <h4 className="card-title">{currentEl.name}</h4>
                                                                <h4 className="card-title">Duration</h4>
                                                                <p className='card-text fw-bold'>{currentEl.courseDuration} Months</p>
                                                                <p className="card-text">Saylani Is the Platform Which provide free it services for all pakistani needy people those who cannot afford its fees and expenses.</p>
                                                                <button className='save-news mx-2' onClick={() => { deleteCourse(currentEl.id, currentEl.time) }}>Delete</button>
                                                                <button className='save-news mx-2' onClick={() => { editCourse(currentEl.id, currentEl.time) }} data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                : ""
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default AddCourse
