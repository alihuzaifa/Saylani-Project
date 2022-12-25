import React from 'react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
    return (
        <>
            {/* <nav>
                <input type="checkbox" id="check" />
                <label htmlFor="check" className="checkbtn">
                    <i className="fas fa-bars" />
                </label>
                <label className="logo">Dashboard</label>
                <ul>
                    <li><Link to="/news" >Add News</Link></li>
                    <li><Link to="/certificate">Certification</Link></li>
                    <li><Link to={"/course"}>Course</Link></li>
                </ul>
            </nav> */}
            <nav className="navbar navbar-expand-lg bg-light py-3">
                <div className="container-fluid">
                    <Link to={"/"} className="dash-logo text-decoration-none h3 fw-bold">Dashboard</Link>
                    {/* <a className="navbar-brand logo" href="/">Dashboard</a> */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className='nav-item'><Link to="/news" className='nav-link dash-logo fs-5 all-admin-links'>Add News</Link></li>
                            <li className='nav-item'><Link to="/certificate" className='nav-link dash-logo fs-5 all-admin-links'>Certification</Link></li>
                            <li className='nav-item'><Link to={"/course"} className='nav-link dash-logo fs-5 all-admin-links'>Course</Link></li>
                        </ul>
                        {/* <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form> */}
                    </div>
                </div>
            </nav>

        </>
    )
}

export default AdminPanel
