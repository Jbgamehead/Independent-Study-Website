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


var sessions = {}


/* utilities */
function fromJson(data) {return new Date(data.y, data.m, data.d, data.h, data.mi, data.s)}
function date(dt) {return dt.getTime()}
function compute(obj, func, initial=0) {
    var value = initial
    for (var i = 0; i < obj.length; i++) value = func(obj[i], value)
    return value
}
// gets a property if it exists
// elsewise, returns the default
function orDefault(obj, property, value) {
    if (Object.hasOwn(obj, property))
        return obj[property]
    return value
}


// checks that the object has all the specified properties
function validate(body, names) {
    // for some reason, a for in loop didn't work here
    for (var i = 0; i < names.length; i++) {
        var name = names[i]

        var obj = body

        var splitText = name.split(".")
        for (var i1 = 0; i1 < splitText.length; i1++) {
            var prop = splitText[i1]

            if (Object.hasOwn(obj, prop)) {
                obj = obj[prop]
            } else {
                // TODO: probably want to display this on the client in a nicer way
                console.log("Invalid query received; lacking " + prop + " of " + name)
                return false
            }
        }
    }
    return true
}

function genToken(email, password, time) {
    var tok = time.getTime() + compute(password, (c, val) => val + c.charCodeAt(0))

    tok *= compute(email, (c, val) => val + c.charCodeAt(0) * c.charCodeAt(0))
    var characters = "abcdefghijklmnopqrstuvwxyz123456789"
    tok = compute(characters, (c, val) => val + c.charCodeAt(0), tok)

    var prev = 0
    var index = 0
    tok = compute(tok.toString(), (c, val) => {
        var res = val + characters[parseInt(c + prev) % characters.length]
        prev = res.charCodeAt(index)
        index = index + 1
        return res
    }, "")

    return tok
}

function checkSessions() {
    var dt = new Date()
    Object.keys(sessions).forEach((key, index) => {
        var session = sessions[key]
        if (session.expirationTime <= dt.getTime()) {
            delete sessions[key]
        }
    })
}

const TWO_HOURS = (((((60)) * 60)) * 2000)

function genSession(email, password, time) {
    var session = {
        email,
        token: genToken(email, password, time),
        expirationTime: (time.getTime() + TWO_HOURS)
    }
    sessions[session.token] = session
    return session
}

var counter = 0

function checkAuth(headers) {
    counter = counter + 1
    if (counter > 30) {
        checkSessions()
        counter = 0
    }

    if (Object.hasOwn(headers, 'token')) {
        var token = headers.token
        if (Object.hasOwn(sessions, token)) {
            var session = sessions[token]
            var time = new Date().getTime()
            if (session.expirationTime > time) {
                session.expirationTime = time + TWO_HOURS
                return true
            }
            console.log('expired')
            return false
        }
        console.log('session non-existent')
        return false
    }
    console.log('no token')
    return false
}


/* database access */
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


/* entry points */
app.post('/getEmployee', (req, res) => {
    if (!checkAuth(req.body)) {res.json({Error: "No Auth"}); return}
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

app.post('/update/:id', (req, res) => {
    if (validate(req, ["params.id", "body.salary"])) {
        if (!checkAuth(req.body)) {res.json({Error: "No Auth"}); return}

        const id = req.params.id
        const sql = "UPDATE employee set salary = ? WHERE id = ?"
        con.query(sql, [req.body.salary, id], (err, result) => {
            if (err) return res.json({ Error: "update employee error in sql" })
            return res.json({ Status: "Success" })
        })
    }
})

app.post('/delete/:id', (req, res) => {
    if (validate(req.params, ["id"])) {
        if (!checkAuth(req.body)) {res.json({Error: "No Auth"}); return}

        const id = req.params.id
        const sql = "DELETE FROM employee WHERE id = ?"
        con.query(sql, [id], (err, result) => {
            if (err) return res.json({ Error: "delete employee error in sql" })
            return res.json({ Status: "Success" })
        })
    }
})

app.post('/adminCount', (req, res) => {
    const sql = "Select count(id) as admin from users"
    if (!checkAuth(req.body)) {res.json({Error: "No Auth"}); return}

    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error running query" })
        return res.json(result)
    })
})

app.post('/employeeCount', (req, res) => {
    if (!checkAuth(req.body)) {res.json({Error: "No Auth"}); return}

    const sql = "Select count(id) as employee from employee"
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error running query" })
        return res.json(result)
    })
})

app.post('/salary', (req, res) => {
    if (!checkAuth(req.body)) {res.json({Error: "No Auth"}); return}

    const sql = "Select sum(salary) as sumOfSalary from employee"
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error running query" })
        return res.json(result)
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ? "
    if (validate(req.body, ["email", "password"])) {
        con.query(sql, [req.body.email, req.body.password], (err, result) => {
            if (err) return res.json({ Status: "Error", Error: "Error running query" })
            if (result.length > 0) {
                var session = genSession(req.body.email, req.body.password, new Date())
                return res.json({ Status: "Success", token: session.token })
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
            if (err) return res.json({ Status: "Error", Error: "Error running query" })
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

app.post('/logout', (req, res) => {
    if (validate(req.body, ['token'])) {
        if (Object.hasOwn(sessions, req.body.token)) {
            delete sessions[req.body.token]
        }
    }
    return res.json({ Status: "Success" })
})

app.post('/dashboard/create', upload.single('image'), (req, res) => {
    const sql = "INSERT INTO employee (`name`,`email`,`password`,`address`,`salary`,`image`) VALUES (?)"

    if (validate(req, ["body.name", "body.password", "body.email", "body.address", "body.salary", "file.filename"])) {
        if (!checkAuth(req.body)) {res.json({Error: "No Auth"}); return}

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


/* calendar functions */
app.post('/calendar/admin/get', (req, res) => {
    const sql = "SELECT * FROM schedule WHERE end >= ? OR start >= ?"
    if (!checkAuth(req.body)) {res.json({Error: "No Auth"}); return}

    const today = new Date()
    const weekStart = new Date(/* year */ today.getFullYear(), /* month */ today.getMonth(), /* day */ today.getDate() - today.getDay())
//    const sqlParam = "TIMESTAMP(\'" + weekStart.getFullYear() + "-" + weekStart.getMonth() + "-" + weekStart.getDate() + "\')"
    const sqlParam = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
    con.query(sql, [sqlParam, sqlParam], (err, result) => {
        if (err) return res.json({ Error: "Error running query" })
        return res.json({Status: "Success", data: result})
    })
})

app.post('/availability/get', (req, res) => {
    const sql = "SELECT * FROM availability WHERE EmployeeId=?"
    console.log(req.body)
    if (!checkAuth(req.body)) {res.json({Error: "No Auth"}); return}

    if (validate(req.body, ["id"])) {
        con.query(sql, req.body.id, (err, result) => {
            if (err) return res.json({ Error: "Error running query" })
            return res.json({Status: "Success", data: result})
        })
    }
})

app.post('/calendar/admin/delete', (req, res) => {
    const sql = "DELETE FROM `schedule` WHERE Event=? AND Location=? AND Assignee=? AND Start=? AND End=?;"

    if (validate(req.body, ["name", "start", "end", "place", "people"])) {
        if (!checkAuth(req.body)) {res.json({Error: "No Auth"}); return}

        const name = req.body.name
        const start = fromJson(req.body.start)
        const end = fromJson(req.body.end)
        const place = req.body.place

        const people = req.body.people
        for (var i = 0; i < people.length; i++) {
            if (people[i] == -1) {
                array.splice(i, 1)
            }
        }

        if (people.length < 1) {
            console.log("Invalid request; no employees are assigned")
            return
        }

        const notes = orDefault(req.body, "notes", "")

        var str = people.toString().replace(" ", "")

        con.query(sql, [name, place.toString(), str, date(start), date(end), notes], (err, result) => {
            console.log(err)
            if (err) return res.json({ Error: "Error running query" })
            return res.json({ Status: "Success" })
        })
    }
})

app.post('/calendar/admin/add', (req, res) => {
    const sql = "INSERT INTO `schedule` (`Event`, `Location`, `Assignee`, `Start`, `End`, `Notes`) VALUES (?, ?, ?, ?, ?, ?)"

    if (validate(req.body, ["name", "start", "end", "place", "people"])) {
        if (!checkAuth(req.body)) {res.json({Error: "No Auth"}); return}

        const name = req.body.name
        const start = fromJson(req.body.start)
        const end = fromJson(req.body.end)
        const place = req.body.place

        const people = req.body.people
        for (var i = 0; i < people.length; i++) {
            if (people[i] == -1) {
                array.splice(i, 1)
            }
        }

        if (people.length < 1) {
            console.log("Invalid request; no employees are assigned")
            return
        }

        const notes = orDefault(req.body, "notes", "")

        var str = people.toString().replace(" ", "")

        con.query(sql, [name, place.toString(), str, date(start), date(end), notes], (err, result) => {
            console.log(err)
            if (err) return res.json({ Error: "Error running query" })
            return res.json({ Status: "Success" })
        })
//        res.json({Status: "NYI"})
    }
})

app.listen(8081, () => {
    console.log("Running")

    const today = new Date()
    const weekStart = new Date(/* year */ today.getFullYear(), /* month */ today.getMonth(), /* day */ today.getDate() - today.getDay())
    console.log("Today's week starts on " + weekStart.toISOString().substring(0, 10))
})
