const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    dateCreated: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Employees', employeeSchema)