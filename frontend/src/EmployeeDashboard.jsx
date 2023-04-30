import React, { useEffect } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Link, Outlet, useNavigate } from "react-router-dom"
import EmployeeSidebar from './EmployeeSidebar.jsx'

function EmployeeDashboard() {
    const navigate = useNavigate()

    return (
        <div class="container-fluid">
            <div class="row flex-nowrap">
                {EmployeeSidebar.sidebar()}
                <div class="col p-0 m-0">
                    <div className='p-2 d-flex justify-content-center border shadow'>
                        <h4>LET'S HAVE A PRODUCTIVE DAY</h4>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default EmployeeDashboard