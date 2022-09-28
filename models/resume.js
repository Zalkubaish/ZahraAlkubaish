const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EducationSchema = new Schema({
    university: String,
    major: String,
    degree: {
        type: String,
        enum: ['Associate', 'Bachelor', 'Master', 'Doctoral']
    },
    startYear: Number,
    endYear: Number,
    myGPA: Number,
    mainGPA: Number,
});

const ExperianceSchema = new Schema({
    company: String,
    jobType: {
        type: String,
        enum: ['Intrenship', 'Wrok']
    },
    jobRole: String,
    location: String,
    startMonth: Number,
    startYear: Number,
    endMonth: Number,
    endYear: Number,
    description: [String]
});

const ResumeSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    yearOfBirth: Number,
    jobTitle: String,
    education: [EducationSchema],
    experiance: [ExperianceSchema],
    city: String,
    country: String
});

module.exports = mongoose.model('Resume', ResumeSchema);