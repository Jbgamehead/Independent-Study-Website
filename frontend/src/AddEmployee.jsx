import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from 'react-cookie'

const cookies = new Cookies()

function AddEmployee() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        salary: '',
        image: ''
    })

    const navigate = useNavigate()

    const handleSumbit = (event) => {
        event.preventDefault();
        const formdata = new FormData();
        formdata.append("name", data.name);
        formdata.append("email", data.email);
        formdata.append("password", data.password);
        formdata.append("address", data.address);
        formdata.append("salary", data.salary);
        formdata.append("image", data.image);
        formdata.append("token", cookies.get('token'));
        axios.post('http://localhost:8081/dashboard/create', formdata)
            .then(res => {
                navigate('/dashboard/employee')
            })
            .catch(err => console.log(err));

    }

    return (
        <div className="d-flex flex-coloumn align-items-center mt-4 px-5 pt-3">
            <div className="mt-4 px-5 pt-3"></div>
            <form class="row g-3 w-50" onSubmit={handleSumbit}>
                <h2>ADD EMPLOYEE</h2>
                <div class="col-12">
                    <label for="inputName" class="form-label">Name</label>
                    <input type="text" placeholder='Enter Employee Name' class="form-control" id="inputName" autoComplete="off"
                        onChange={e => setData({ ...data, name: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputEmail4" class="form-label">Email</label>
                    <input type="email" placeholder='Enter Email' class="form-control" id="inputEmail4" autoComplete="off"
                        onChange={e => setData({ ...data, email: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputPassword4" class="form-label">Password</label>
                    <input type="password" placeholder='Enter Password' class="form-control" id="inputPassword4"
                        onChange={e => setData({ ...data, password: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputSalary" class="form-label">Salary</label>
                    <input type="text" placeholder='0' class="form-control" id="inputSalary" autoComplete="off"
                        onChange={e => setData({ ...data, salary: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputAddress" class="form-label">Address</label>
                    <input type="address" placeholder='1234 Main Street' class="form-control" id="inputAddress" autoComplete="off"
                        onChange={e => setData({ ...data, address: e.target.value })} />
                </div>
                <div class="col-12 mb-3">
                    <label for="inputGroupFile01" class="form-label">Select Image</label>
                    <input type="file" class="form-control" id="inputGroupFile01"
                        onChange={e => setData({ ...data, image: e.target.files[0] })} />
                </div>
                <div class="col-12">
                    <button type="sumbit" class="btn btn-primary">Create</button>
                </div>
            </form>
        </div>
    );
}

export default AddEmployee;