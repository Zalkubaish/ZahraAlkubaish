const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require("fs");

const Resume = require('../models/resume');
const catchAsync = require('../utils/catchAsync');

router.get('/aboutme', catchAsync(async (req, res) => {
    const resume = await Resume.findOne({});
    let directory_name = "public/imgs/skillsIcons";
    // Function to get current filenames
    // in directory
    let filenames = fs.readdirSync(directory_name);

    res.render('aboutme', { resume, filenames });
}));

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = await Resume.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        req.session.user_id = user._id;
        res.render('home');
    } else {
        res.render('login');
    }

    // const hash = await bcrypt.hash(password, 12);
    // res.send(hash);
}));

module.exports = router;