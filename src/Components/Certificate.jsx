import React, { useEffect, useState } from 'react';
import AdminPanel from './AdminPanel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import swal from 'sweetalert';
import { db, storage } from "../Config/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, where } from "firebase/firestore";

const Certificate = () => {

    const [getData, setGetData] = useState(true)
    const [studentName, setStudentName] = useState("");
    const [studentRollNumber, setStudentRollNumber] = useState("");
    const [studentCourse, setStudentCourse] = useState("");
    const [studentSection, setStudentSection] = useState("");
    const [studentPic, setStudentPic] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [click, setClick] = useState(false);
    const [modalStudentName, setModalStudentName] = useState("");
    const [modalStudentRollNumber, setModalStudentRollNumber] = useState("");
    const [modalStudentCourse, setModalStudentCourse] = useState("");
    const [modalStudentSection, setModalStudentSection] = useState("");
    const [modalStudentPicture, setModalStudentPicture] = useState(null);
    const [modalStudentCode, setModalStudentCode] = useState("");
    const [changeModalStudentName, setChangeModalStudentName] = useState("");
    const [docId, setDocId] = useState("")

    // Get Data From Database
    const fetchData = async () => {
        let collectionRef = collection(db, "certificate")
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

    // Generate Maker
    const generate = async () => {
        if (studentName !== "" && studentRollNumber !== "" && studentCourse !== "" && studentSection !== "" && studentPic !== null) {
            let imageRef = studentPic.name
            let storageRef = ref(storage, `images/certificate/${imageRef}`);
            try {
                setClick(true)
                let id = Math.floor(new Date().getTime() / 1000000)
                await uploadBytes(storageRef, studentPic);
                let url = await getDownloadURL(storageRef)
                await addDoc(collection(db, "certificate"), {
                    name: studentName, rollNumber: studentRollNumber, course: studentCourse, section: studentSection, picture: url, time: new Date().getTime(), code: id
                });
                setClick(false)
                setGetData(true)
                setStudentName("");
                setStudentCourse("");
                setStudentRollNumber("");
                setStudentSection("");
                swal("Secret Code", `${id}`, "success");
            } catch (e) {
                console.log(e)
            }
        } else {
            swal({
                title: "All Data is Required?",
                text: "Fill All Data To Make Certificates Code!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
        }
    }

    // Edit Function
    const editCertificate = async (id, code) => {
        let collectionRef = collection(db, "certificate")
        let CollectionQuery = where("code", "==", code)
        const q = query(collectionRef, CollectionQuery);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                setModalStudentName(data.name);
                setModalStudentRollNumber(data.rollNumber);
                setModalStudentCourse(data.course);
                setModalStudentSection(data.section);
                setModalStudentPicture(data.picture);
                setModalStudentCode(data.code)
            });
            setDocId(id)
        });
        return () => unsubscribe()
    }

    // Delete Function
    const deleteCertificate = async (id, time) => {
        await deleteDoc(doc(db, "certificate", id));
        documents.filter((currentEl, index) => {
            return (
                currentEl?.time !== time
            )
        })
    }

    // Save Data Again In Firebase
    const saveData = async () => {
        if (modalStudentName !== "" && modalStudentRollNumber !== "" && modalStudentCourse !== "" && modalStudentCode !== "" && modalStudentSection !== "") {
            const collectionRef = doc(db, "certificate", docId);
            if (changeModalStudentName !== "") {
                let imageRef = changeModalStudentName.name
                setClick(true)
                let storageRef = ref(storage, `images/certificate/${imageRef}`);
                try {
                    await uploadBytes(storageRef, changeModalStudentName);
                    let url = await getDownloadURL(storageRef);
                    await updateDoc(collectionRef, {
                        name: modalStudentName, rollNumber: modalStudentRollNumber, course: modalStudentCourse, code: modalStudentCode, section: modalStudentSection, picture: url, time: new Date().getTime()
                    })
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
                        name: modalStudentName, rollNumber: modalStudentRollNumber, course: modalStudentCourse, code: modalStudentCode, section: modalStudentSection, time: new Date().getTime()
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
            {/* Modal Start */}
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Certificate Data</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="modal-image mb-3 text-center">
                                <img src={modalStudentPicture} alt="modal-imagee" className='modal-picture' onChange={(e) => { setModalStudentPicture(e.target.files) }} />
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="abcd" value={modalStudentName} onChange={(e) => { setModalStudentName(e.target.value) }} />
                                <label htmlFor="floatingInput">Name:</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="abcd" value={modalStudentRollNumber} onChange={(e) => { setModalStudentRollNumber(e.target.value) }} />
                                <label htmlFor="floatingInput">Roll Number:</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="abcd" value={modalStudentCourse} onChange={(e) => { setModalStudentCourse(e.target.value) }} />
                                <label htmlFor="floatingInput">Course:</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="abcd" value={modalStudentSection} onChange={(e) => { setModalStudentSection(e.target.value) }} />
                                <label htmlFor="floatingInput">Section:</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="abcd" value={modalStudentCode} onChange={(e) => { setModalStudentCode(e.target.value) }} />
                                <label htmlFor="floatingInput">Certificate Code:</label>
                            </div>
                            <div className="mb-3">
                                <input className="form-control" type="file" files={changeModalStudentName} id="formFileMultiple" onChange={(e) => { setChangeModalStudentName(e.target.files[0]) }} />
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
            {/* Modal End */}

            <div className="conatainer my-4">
                <div className="row">
                    <div className="col offset-0 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                        <div className="card pt-2 pb-3 px-4">
                            <div>
                                <div className="head-news text-center mb-3 mt-3">
                                    <span className='bg-dark h5 text-white p-2 rounded'>Certificate Of Completion</span>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control student-name" id="floatingInput" placeholder="name@example.com" value={studentName} onChange={(e) => { setStudentName(e.target.value) }} />
                                    <label htmlFor="floatingInput" className='text-center'>Student Name:</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control student-name" id="floatingInput" placeholder="name@example.com" value={studentRollNumber} onChange={(e) => { setStudentRollNumber(e.target.value) }} />
                                    <label htmlFor="floatingInput" className='text-center'>Student RollNumber:</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control student-name" id="floatingInput" placeholder="name@example.com" value={studentCourse} onChange={(e) => { setStudentCourse(e.target.value) }} />
                                    <label htmlFor="floatingInput" className='text-center'>Student Course:</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control student-name" id="floatingInput" placeholder="name@example.com" value={studentSection} onChange={(e) => { setStudentSection(e.target.value) }} />
                                    <label htmlFor="floatingInput" className='text-center'>Student Section:</label>
                                </div>
                                <div>
                                    <input className="form-control form-control-lg" id="formFileLg" type="file" onChange={(e) => { setStudentPic(e.target.files[0]) }} />
                                </div>
                                <div className="mt-4 mb-1 text-center">
                                    <button className="save-news" disabled={click} onClick={generate}>{
                                        click ?
                                            <div className="spinner-border"></div>
                                            : "Generate Code"
                                    }</button>
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
                                All Certificates
                            </div>
                        </div>
                    </div>
                    : null
            }
            <div className="container mb-5 mt-3">
                {
                    documents.length > 0 ?
                        <div className="row text-center fw-bold bg-dark text-white py-2">
                            <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1">Name:</div>
                            <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1">RollNumber:</div>
                            <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1">Coures:</div>
                            <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1">Section:</div>
                            <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1">Photo</div>
                            <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1">Actions</div>
                        </div>
                        : null
                }
                {
                    documents ?
                        documents.map((certifficate, index) => {
                            return (
                                <div className="row text-center fw-bold bg-light py-2 my-1" key={index}>
                                    <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1">{certifficate.name}</div>
                                    <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1">{certifficate.rollNumber}</div>
                                    <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1">{certifficate.course}</div>
                                    <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1">{certifficate.section}</div>
                                    <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1">
                                        <img src={certifficate.picture} alt="certificates" className='course-img' />
                                    </div>
                                    <div className="col-6 col-sm-6 col-md-4 col-lg-2 py-2 py-sm-2 py-md-1"><DeleteIcon className='delete-icon' onClick={() => { deleteCertificate(certifficate?.id, certifficate?.time) }} /><EditIcon className='edit-icon' onClick={() => { editCertificate(certifficate?.id, certifficate.code) }} data-bs-toggle="modal" data-bs-target="#exampleModal" /></div>
                                </div>
                            )
                        })
                        : null
                }
            </div>
        </>
    )
}

export default Certificate;
