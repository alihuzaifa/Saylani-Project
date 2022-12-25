import React from 'react'

const Navbar = () => {
    return (
        <>
            <nav>
                <input type="checkbox" id="check" />
                <label htmlFor="check" className="checkbtn">
                    <i className="fas fa-bars" />
                </label>
                <label className="logo">Saylani</label>
                <ul>
                    <li><a className="active" href="/">Home</a></li>
                    <li><a href="/">News</a></li>
                    <li><a href="/">Classes</a></li>
                    <li><a href="/">Contact</a></li>
                    <li><a href="/">Certificate</a></li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar
