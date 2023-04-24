import React from 'react'
import Navbar from './Navbar';
import Footer from './Footer';
import { NavLink } from "react-router-dom";

const Start = () => {
    return (
        <div>
            <Navbar />
            <div className='d-flex justify-content-center align-items-center vh-100 loginPage' >
                <div className='p-3 rounded w-25 border loginForm text-center' >
                    <h1 className="display-6 fw-bolder mb-5">LOGIN AS</h1>
                    <div className="d-flex justify-content-between mt-5">
                        <NavLink to="/employeelogin" className='btn btn-primary btn-lg' >Employee</NavLink>
                        <NavLink to="/login" className='btn btn-warning btn-lg' >Admin</NavLink>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Start;