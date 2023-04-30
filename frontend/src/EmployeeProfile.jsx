import React from 'react'
import './App.css'


function EmployeeProfile() {
    return (
        <div className="d-flex flex-coloumn align-items-center mt-4 px-5 pt-3">
            <div className="mt-4 px-5 pt-3">
                <form class="row g-3 w-75">


                    <img
                        src="../src/assets/maxresdefault.jpg"
                        className="w-75"
                        style={{ width: 400, height: 400, borderRadius: 400 / 2 }}
                    />
                </form>
            </div>
        </div>
    )
}

export default EmployeeProfile