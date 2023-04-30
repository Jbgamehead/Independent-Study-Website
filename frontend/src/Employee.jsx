import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Query from './util/Query.jsx'

const Employee = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        Query.get('http://localhost:8081/getEmployee')
            .then(res => {
                if (res.data.Status === "Success") {
                    setData(res.data.Result);
                } else {
                    alert("Error")
                }
            })
            .catch(err => console.log(err));
    }, [])

    const handleDelete = (id) => {
        Query.del('http://localhost:8081/delete/' + id)
            .then(res => {
                if (res.data.Status === "Success") {
                    window.location.reload(true);
                } else {
                    alert("Error")
                }
            })
            .catch(err => console.log(err));
    }


    return (
        <div className='px-5 py-3'>
            <div className="d-flex justify-content-center">
                <h3>Employee List</h3>
            </div>
            <Link to="/dashboard/create" className="btn btn-success">Add Employee</Link>
            <div className="mt-3">
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Salary</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((employee, index) => {
                            return <tr key={index}>
                                <td>{
                                    <img src={`http://localhost:8081/images/` + employee.image} alt="" className="employee_image" />
                                }</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.address}</td>
                                <td>{employee.salary}</td>
                                <td>
                                    <Link to={`/dashboard/employeeEdit/` + employee.id} className="btn btn-primary btn-sm me-2">edit</Link>
                                    <button onClick={e => handleDelete(employee.id)} className="btn btn-sm btn-danger">delete</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Employee;