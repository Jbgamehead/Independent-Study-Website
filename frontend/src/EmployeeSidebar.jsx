import { Link, Outlet, useNavigate } from "react-router-dom"
import axios from "axios";
import { useCookies } from 'react-cookie'



function EmployeeSidebar() {
    const navigate = useNavigate()

    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout')
            .then(res => {

                removeCookie('employee_id', {path:'/'})
                navigate('/start')
            }).catch(err => console.log(err));
    }
    return (
        <div class="container-fluid">
            <div class="row flex-nowrap">
                <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                    <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <Link to="/employee/" class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                            <span class="fs-5 d-none d-sm-inline"><strong>Employee Dashboard</strong></span>
                        </Link>
                        <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li>
                                <Link to="/employee/calendar" data-bs-toggle="collapse" class="nav-link px-0 align-middle text-white">
                                    <i class="fs-4 bi-calendar"></i> <span class="ms-1 d-none d-sm-inline text-white ">Calendar</span> </Link>
                            </li>
                            <li>
                                <Link to="/employee/availability" class="nav-link px-0 align-middle text-white">
                                    <i class="fs-4 bi-box"></i> <span class="ms-1 d-none d-sm-inline text-white">Days Available</span></Link>
                            </li>
                            <li>
                                <Link to="/employee/profile" class="nav-link px-0 align-middle text-white">
                                    <i class="fs-4 bi-person"></i> <span class="ms-1 d-none d-sm-inline text-white">Profile</span></Link>
                            </li>
                            <li onClick={handleLogout}>
                                <a href="#" class="nav-link px-0 align-middle text-white">
                                    <i class="fs-4 bi-power"></i> <span class="ms-1 d-none d-sm-inline text-white">Logout</span> </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col p-0 m-0">
                    <div className='p-2 d-flex justify-content-center border shadow'>
                        <h4>Employee Dashboard</h4>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default EmployeeSidebar