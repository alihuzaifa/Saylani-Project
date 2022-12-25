import React, { useState, useEffect } from 'react';
import AdminPanel from './AdminPanel';
import img from "../image/person.gif"
import swal from 'sweetalert';
import { db, storage } from "../Config/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, where } from "firebase/firestore";


const News = () => {
    const [title, setTitle] = useState("");
    const [detail, setDetail] = useState("");
    const [picture, setPicture] = useState(null);
    const [click, setClick] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDetail, setModalDetail] = useState("");
    const [modalPicture, setModalPicture] = useState(img);
    const [docId, setDocId] = useState("");
    const [changeModalPicture, setChangeModalPicture] = useState(null)

    const addNews = async () => {
        if (title !== "" && detail !== "" && picture !== null) {
            let imageRef = picture.name
            let storageRef = ref(storage, `images/news/${imageRef}`);
            try {
                setClick(true)
                await uploadBytes(storageRef, picture);
                let url = await getDownloadURL(storageRef)
                await addDoc(collection(db, "news"), {
                    title: title, detail: detail, picture: url
                });
                setClick(false)
                setTitle("");
                setDetail("");
            } catch (e) {
                console.log(e)
            }
        }
        else {
            console.log("Stop");
        }
    }

    const fetchData = async () => {
        let collectionRef = collection(db, "news")
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

    const deleteNews = async (id, time) => {
        let docRef = doc(db, "news", id)
        await deleteDoc(docRef);
        documents.filter((currentEl, index) => {
            return (
                currentEl?.time !== time
            )
        })
    }

    const editNews = (id, time) => {
        let collectionRef = collection(db, "news")
        let CollectionQuery = where("time", "==", time)
        const q = query(collectionRef, CollectionQuery);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                setModalTitle(data.title);
                setModalDetail(data.detail);
                setModalPicture(data.picture)
            });
            setDocId(id)
        });
        return () => unsubscribe()
    }

    const updateData = async () => {
        if (modalDetail !== "" && modalTitle !== "") {
            const collectionRef = doc(db, "news", docId);
            if (changeModalPicture !== null) {
                let imageRef = changeModalPicture.name
                setClick(true)
                let storageRef = ref(storage, `images/news/${imageRef}`);
                try {
                    await uploadBytes(storageRef, changeModalPicture);
                    let url = await getDownloadURL(storageRef);
                    await updateDoc(collectionRef, {
                        time: new Date().getTime(),
                        title: modalTitle,
                        detail: modalDetail,
                        picture: url
                    })
                    setModalTitle("");
                    setModalDetail("");
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
                        title: modalTitle, detail: modalDetail, time: new Date().getTime()
                    });
                    setModalTitle("");
                    setModalDetail("");
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
            <div className="conatainer mt-5">
                <div className="row">
                    <div className="col offset-0 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                        <div className="card py-2 px-4">
                            <div>
                                <div className="head-news text-center mb-4 mt-3">
                                    <span className='bg-dark h5 text-white p-2 rounded'>Add News</span>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="name" className="form-control" id="floatingInput" placeholder="name@example.com" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                                    <label htmlFor="floatingInput">Title</label>
                                </div>
                                <div className="form-floating mt-3">
                                    <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea" value={detail} onChange={(e) => { setDetail(e.target.value) }}></textarea>
                                    <label htmlFor="floatingTextarea">Details</label>
                                </div>
                                <div>
                                    <input className="form-control form-control-lg mt-3" id="formFileLg" type="file" onChange={(e) => { setPicture(e.target.files[0]) }} />
                                </div>
                                <div className="mt-3 mb-1 text-center">
                                    {
                                        click ?
                                            <button className="save-news" onClick={addNews} disabled={click}><div className="spinner-border"></div></button>
                                            :
                                            <button className="save-news" onClick={addNews}>Save</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Start */}
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 " id="exampleModalLabel">News Details</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="modal-image mb-3 text-center">
                                <img src={modalPicture} alt="modal-imag" className='modal-picture' />
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="abcd" value={modalTitle} onChange={(e) => { setModalTitle(e.target.value) }} />
                                <label htmlFor="floatingInput">Title</label>
                            </div>
                        </div>
                        <div className="mb-3 mx-3">
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} value={modalDetail} onChange={(e) => { setModalDetail(e.target.value) }} />
                        </div>
                        <div className="mb-3 mx-3">
                            <input className="form-control" type="file" files={changeModalPicture} id="formFileMultiple" onChange={(e) => { setChangeModalPicture(e.target.files[0]) }} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {
                                click ? <button type="button" className="btn btn-primary" onClick={updateData} disabled={click}><div className="spinner-border"></div></button> : <button type="button" className="btn btn-primary" onClick={updateData}>Save changes</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal End */}

            {
                documents.length > 0 ?
                    <div className="container my-5">
                        <div className="row">
                            <div className="col h2 text-center fw-bold text-decoration-underline">
                                All News
                            </div>
                        </div>
                    </div>
                    : null
            }

            <div className="container">
                <div className="row">
                    {
                        documents.length > 0 ?
                            documents.map((currentEl, index) => {
                                return (
                                    <div className="col-12 offset-0 col-sm-8 offset-sm-2 col-md-6 offset-md-0 col-lg-4 my-1 my-sm-1 my-md-1 my-lg-0" key={index}>
                                        <div className="card">
                                            <img src={currentEl.picture} className="card__image" alt="news-pic" />
                                            <div className="card_title h3 fw-bold text-center">
                                                {
                                                    currentEl.title
                                                }
                                            </div>
                                            <div className="card__btn py-3 d-flex justify-content-evenly">
                                                <button className='save-news d-block' onClick={() => { deleteNews(currentEl?.id, currentEl?.time) }}>Delete</button>
                                                <button className='save-news d-block' onClick={() => { editNews(currentEl?.id, currentEl.time) }} data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })
                            : ""
                    }

                </div>
            </div>
        </>
    )
}

export default News
