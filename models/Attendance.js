const mongoose = require('mongoose')

const AttendanceSchema = new mongoose.Schema({
    "EMPLOYEE_IDENTIFIER": {
        type: String,
        required: true
    },
    "CHECK-IN": {
        type: String,
        required: true
    },
    "CHECK-OUT": {
        type: String,
        required: false
    },
    COMMENT: {
        type: String,
        required: false
    },
    DURATION: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Attendance', AttendanceSchema)