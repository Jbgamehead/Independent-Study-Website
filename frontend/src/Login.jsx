import React, { useState } from 'react'
import './App.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

import { useCookies } from 'react-cookie'


function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()
    const [error, setError] = useState('')

    const [cookies, setCookie] = useCookies(['token'])

    const handleSumbit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/login', values)
            .then(res => {
                if (res.data.Status === 'Success') {
                    console.log("success")
                    setCookie('token', res.data.token, { path: '/', SameSite: "Lax"})
                    setCookie('auth_type', "admin", { path: '/', SameSite: "Lax"})
                    navigate('/dashboard');
                } else {
                    setError(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <Navbar />
            <div className="container shadow my-5">
                <div className="row">
                    <div className="col-md-5 d-flex flex-column 
          align-items-center text-white justify-content-center form">
                        <h1 className="display-4 fw-bolder">Welcome Back</h1>
                        <p className="lead text-center">Enter Your Credentials To Login</p>
                    </div>
                    <div className="col-md-6 p-5">
                        <div className='text-danger'>
                            {error && error}
                        </div>
                        <h1 className="display-6 fw-bolder mb-5">ADMIN LOGIN</h1>
                        <form onSubmit={handleSumbit}>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Email address</label>
                                <input type="email" placeholder='Enter Your Email' class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                    name="email" onChange={e => setValues({ ...values, email: e.target.value })} />
                                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">Password</label>
                                <input type="password" placeholder='Enter Your Password' class="form-control" id="exampleInputPassword1"
                                    name="password" onChange={e => setValues({ ...values, password: e.target.value })} />
                            </div>
                            <button type="submit" class="btn btn-primary w-100 rounded-pill ">Login</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Login