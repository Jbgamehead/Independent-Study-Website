import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Query from './util/Query.jsx'

function EmployeeEdit() {
    const [data, setData] = useState({
        name: '',
        email: '',
        address: '',
        salary: '',
    })

    const navigate = useNavigate()

    const { id } = useParams();

    useEffect(() => {
        axios.get('http://localhost:8081/get/' + id)
            .then(res => {
                setData({
                    ...data, name: res.data.Result[0].name,
                    email: res.data.Result[0].email,
                    address: res.data.Result[0].address,
                    salary: res.data.Result[0].salary
                })
            })
            .catch(err => console.log(err));
    }, [])

    const handleSumbit = (event) => {
        event.preventDefault();
        Query.put('http://localhost:8081/update/' + id, data)
            .then(res => {
                if (res.data.Status === "Success") {
                    navigate('/dashboard/employee')
                }
            })
            .catch(err => console.log(err));

    }

    return (
        <div className="d-flex flex-coloumn align-items-center mt-4 px-5 pt-3">
            <div className="mt-4 px-5 pt-3"></div>
            <form class="row g-3 w-50" onSubmit={handleSumbit}>
                <h2>UPDATE EMPLOYEE</h2>
                <div class="col-12">
                    <label for="inputName" class="form-label">Name</label>
                    <input type="text" placeholder='Enter Employee Name' class="form-control" id="inputName" autoComplete="off"
                        onChange={e => setData({ ...data, name: e.target.value })} value={data.name} />
                </div>
                <div class="col-12">
                    <label for="inputEmail4" class="form-label">Email</label>
                    <input type="email" placeholder='Enter Email' class="form-control" id="inputEmail4" autoComplete="off"
                        onChange={e => setData({ ...data, email: e.target.value })} value={data.email} />
                </div>
                <div class="col-12">
                    <label for="inputSalary" class="form-label">Salary</label>
                    <input type="text" placeholder='0' class="form-control" id="inputSalary" autoComplete="off"
                        onChange={e => setData({ ...data, salary: e.target.value })} value={data.salary} />
                </div>
                <div class="col-12">
                    <label for="inputAddress" class="form-label">Address</label>
                    <input type="address" placeholder='1234 Main Street' class="form-control" id="inputAddress" autoComplete="off"
                        onChange={e => setData({ ...data, address: e.target.value })} value={data.address} />
                </div>
                <div class="col-12">
                    <button type="sumbit" class="btn btn-primary">Update</button>
                </div>
            </form>
        </div>
    );
}

export default EmployeeEdit;