import React from 'react'
import Login from './Login'
import Dashboard from './Dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Employee from './Employee'
import Profile from './Profile'
import Home from './Home'
import About from './About'
import Services from './Services'
import Contact from './Contact'
import Dashhome from './Dashhome'
import AddEmployee from './AddEmployee'
import Calendar from './Calendar'
import EmployeeEdit from './employeeEdit'
import Start from './Start'
import EmployeeLogin from './EmployeeLogin'
import EmployeeDetail from './EmployeeDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/employeelogin' element={<EmployeeLogin />} />
        <Route path='/employeedetail/:id' element={<EmployeeDetail />} />
        <Route path='/start' element={<Start />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="/dashboard/dashhome" element={<Dashhome />} />
          <Route path="/dashboard/calendar" element={<Calendar />} />
          <Route path="/dashboard/employee" element={<Employee />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/create" element={<AddEmployee />}></Route>
          <Route path="/dashboard/employeeEdit/:id" element={<EmployeeEdit />}></Route>
        </Route>
      </Routes>

    </BrowserRouter>
  )
}

export default App
