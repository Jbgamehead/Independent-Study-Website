import express, { response } from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))


/* utilities */
function validate(body, names) {
    // for some reason, a for in loop didn't work here
    names.forEach((name) => {
        console.log(name)
        var obj = body
        for (var prop in name.split(".")) {
            if (prop in obj) {
                obj = obj[prop]
            } else {
                return false
            }
        }
    })
    return true
}


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

con.connect((err) => {
    if (err) {
        console.log("Error While Connecting Database")
    } else {
        console.log("Database Connected")
    }
})

app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee"
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" })
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/get/:id', (req, res) => {
    if (validate(req.params, ["id"])) {
        const id = req.params.id
        const sql = "SELECT * FROM employee where id = ?"
        con.query(sql, [id], (err, result) => {
            if (err) return res.json({ Error: "Get employee error in sql" })
            return res.json({ Status: "Success", Result: result })
        })
    }
})

app.put('/update/:id', (req, res) => {
    if (validate(req, ["params.id", "body.salary"])) {
        const id = req.params.id
        const sql = "UPDATE employee set salary = ? WHERE id = ?"
        con.query(sql, [req.body.salary, id], (err, result) => {
            if (err) return res.json({ Error: "update employee error in sql" })
            return res.json({ Status: "Success" })
        })
    }
})

app.delete('/delete/:id', (req, res) => {
    if (validate(req.params, ["id"])) {
        const id = req.params.id
        const sql = "DELETE FROM employee WHERE id = ?"
        con.query(sql, [id], (err, result) => {
            if (err) return res.json({ Error: "delete employee error in sql" })
            return res.json({ Status: "Success" })
        })
    }
})

app.get('/adminCount', (req, res) => {
    const sql = "Select count(id) as admin from users"
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in running query" })
        return res.json(result)
    })
})

app.get('/employeeCount', (req, res) => {
    const sql = "Select count(id) as employee from employee"
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in running query" })
        return res.json(result)
    })
})

app.get('/salary', (req, res) => {
    const sql = "Select sum(salary) as sumOfSalary from employee"
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in running query" })
        return res.json(result)
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ? "
    if (validate(req.body, ["email", "password"])) {
        con.query(sql, [req.body.email, req.body.password], (err, result) => {
            if (err) return res.json({ Status: "Error", Error: "Error in running query" })
            if (result.length > 0) {
                return res.json({ Status: "Success" })
            } else {
                return res.json({ Status: "Error", Error: "Wrong Email or Password" })
            }
        })
    }
})

app.post('/employeelogin', (req, res) => {
    const sql = "SELECT * FROM employee WHERE email = ?"
    if (validate(req.body, ["email", "password"])) {
        con.query(sql, [req.body.email, req.body.password], (err, result) => {
            if (err) return res.json({ Status: "Error", Error: "Error in running query" })
            if (result.length > 0) {
                bcrypt.compare(req.body.password.toString(), result[0].password, (err, response) => {
                    if (err) return res.json({ Error: "password error" })
                })
                return res.json({ Status: "Success" })
            } else {
                return res.json({ Status: "Error", Error: "Wrong Email or Password" })
            }
        })
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({ Status: "Success" })
})

app.post('/dashboard/create', upload.single('image'), (req, res) => {
    const sql = "INSERT INTO employee (`name`,`email`,`password`,`address`,`salary`,`image`) VALUES (?)"
//    if (req.file && req.file.filename) {
    if (validate(req.body, ["name", "password", "email", "address", "salary", "filename"])) {
        bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
            if (err) return res.json({ Error: "Error wile hashing password" })
            const values = [
                req.body.name,
                req.body.email,
                hash,
                req.body.address,
                req.body.salary,
                req.file.filename
            ]
            con.query(sql, [values], (err, result) => {
                if (err) return res.json({ Error: "Inside signup query" })
                return res.json({ Status: "Success" })
            })
        })
    }
})

app.listen(8081, () => {
    console.log("Running")
})

