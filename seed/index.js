const mongoose = require('mongoose');
// const { places, descriptors } = require('./seedHelpers');
const Resume = require('../models/resume');


// Database Connection
mongoose.connect('mongodb://localhost:27017/resumeDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

// const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Resume.deleteMany({});
    // const random1000 = Math.floor(Math.random() * 1000);
    const resume = new Resume({
        firstName: 'Zahra',
        lastName: 'Al Kubaish',
        yearOfBirth: 1995,
        jobTitle: 'Web Developer',
        education: [{
            university: 'Imam Abdulrahman bin Faisal University',
            major: 'Computer Sience',
            degree: 'Bachelor',
            startYear: 2017,
            endYear: 2022,
            myGPA: 4.71,
            mainGPA: 5,
        }],
        experiance: [{
            company: 'Saudi Aramco',
            jobType: 'Intrenship',
            jobRole: 'Web Developer',
            location: 'Ras Tanura, Saudi Arabia',
            startMonth: 6,
            startYear: 2021,
            endMonth: 8,
            endYear: 2021,
            description: ['Developed C# ASP.NET core web app to improve the work system in the HR department by preparing monitoring software, which required high SQL management.', 'Provided technical support by guiding and implementing updates to tools and technologies of existing application.', 'Evaluated and developed analysis and reporting processes in HR management.']
        }],
        city: 'Eastren Proviance',
        country: 'Saudi Arabia'
    });
    await resume.save();
}
seedDB().then(() => {
    mongoose.connection.close();
});
