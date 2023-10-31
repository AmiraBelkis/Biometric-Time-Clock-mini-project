const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');
const Employee = require('./models/employees');

const app = express();
app.use(express.json());

// connect to DB
mongoose.connect('mongodb://localhost:27017/BiometricTimeClock', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

/** Employee object format:
 * "id": "STRING",
 * "lastName": "STRING",
 * "firstName": "STRING",
 * "dateCreated": "DATE",
 * "department": "STRING",
 **/

/** Attendance object format: 
 * "ID": "STRING",
 * "EMPLOYEE_IDENTIFIER": "STRING"
 * "CHECK-IN": "2020-09-22T10:00:00", //STRING
 * "CHECK-OUT": "2020-09-22T18:00:00", //STRING
 * "COMMENT": "absent from 15h00 to 15h15", //STRING
 * "DURATION": "8 hours and 0 minutes", //STRING
 **/


// End-point to add new employee to the DB
app.post('/API/CreateEmp/', async(req, res) => {
    // Verify the input data 
    const schema = Joi.object({
        lastName: Joi.string()
            .pattern(/^[a-zA-Z]+$/)
            .min(3)
            .max(50)
            .required(),
        firstName: Joi.string()
            .pattern(/^[a-zA-Z\s]+$/)
            .min(3)
            .max(50)
            .required(),
        department: Joi.string()
            .alphanum()
            .min(2)
            .max(150)
            .required()
    })
    const { error, value } = schema.validate(req.body);
    if (error) { // raise erreur data entred not valide
        res.status(400).send(error)
    } else { // create new employee object
        let today = new Date();
        today = today.toISOString().slice(0, 10);
        const emp = {
            "lastName": req.body.lastName,
            "firstName": req.body.firstName,
            "dateCreated": today,
            "department": req.body.department,
        };
        try { // insert in DB
            let employee = new Employee(emp)
            const newEmployee = await employee.save()
            res.status(201).send(newEmployee)
        } catch (error) { // handle server error
            res.status(500).send(error.message)
        }
    }

})

// End-point to get list of employees 
app.get('/API/GetEmp/:date', async(req, res) => {
    try {
        const employees = await Employee.find()
        let employee = employees.filter(c => c.dateCreated === req.params.date);
        if (employee.length === 0) {
            res.status(404).send(`No employee was created on ${req.params.date}`)
        } else {
            res.status(200).send(employee)
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.get('/API/GetEmp/', async(req, res) => {
    try {
        const employees = await Employee.find()
        res.status(200).send(employees)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// End-point to perform check-in
app.post('/API/CheckIn/', async(req, res) => {
    const schema = Joi.object({
        EMPLOYEE_IDENTIFIER: Joi.string().required(),
        COMMENT: Joi.string()
            .min(3)
            .max(500)
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
        res.status(400).send(error)
    } else {
        let now = new Date();
        today = now.toISOString().slice(0, 19);
        const checkin_ = {
            "EMPLOYEE_IDENTIFIER": req.body.EMPLOYEE_IDENTIFIER,
            "CHECK-IN": today,
            "COMMENT": req.body.COMMENT,
        };
        try { // insert in DB
            let checkin = new Attendance(checkin_)
            const newCheckin = await checkin.save()
            res.status(201).send(newCheckin)
        } catch (error) { // handle server error
            res.status(500).send(error.message)
        }
    }

})

// End-point to perform check-out
app.patch('/API/CheckOut/', async(req, res) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        COMMENT: Joi.string()
            .min(3)
            .max(500)
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
        res.status(400).send(error)
    } else {
        let today = new Date();
        today = today.toISOString().slice(0, 19);
        const checkout_ = {
            "Id": req.body.id,
            "CHECK-OUT": today,
            "COMMENT": req.body.COMMENT,
        };
        try { // insert in DB
            let checkout = await Attendance.findById(checkout_.Id);
            if (checkout) {
                checkout["CHECK-OUT"] = checkout_["CHECK-OUT"];
                checkout["COMMENT"] = (checkout_["COMMENT"]) ? checkout["COMMENT"] + " - " + checkout_["COMMENT"] : checkout["COMMENT"];
                const updatedAttendance = await checkout.save()
                res.status(201).send(updatedAttendance)
            } else {
                res.status(404).send("No employee has a checkin with the specified ID")
            }

        } catch (error) { // handle server error
            res.status(500).send(error.message)
        }
    }
});

// End-point to calculate the time between check-in and check-out
app.patch('/API/Duration/:id', async(req, res) => {
    try {
        let schedule = await Attendance.findById(req.params.id);
        if (schedule === null) {
            res.status(404).send("Can't calculate the duration, schedule doesn't exist.")
        } else {
            console.log(schedule)
            let duration = 0;
            checkIn = new Date(schedule['CHECK-IN']);
            checkOut = new Date(schedule['CHECK-OUT']);
            console.log({ checkIn, checkOut })
            duration = checkOut - checkIn; // duration in milliseconds

            const hours = Math.floor(duration / 3600000); // 1 hour = 3600000 milliseconds
            const minutes = Math.floor((duration % 3600000) / 60000); // 1 minute = 60000 milliseconds

            schedule.DURATION = `${hours} hours and ${minutes} minutes`;
            const updatedAttendance = await schedule.save()
            res.status(201).send(updatedAttendance)
        }
    } catch (error) { // handle server error
        res.status(500).send(error.message)
    }
});

const port = 3000
app.listen(port, () => {
    console.log(`listening on port ${port} ...`)
})