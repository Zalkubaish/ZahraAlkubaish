if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
// Import the filesystem module

const session = require('express-session');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize'); //for SQL injections
const helmet = require('helmet');

const app = express();
const ExpressError = require('./utils/ExpressError.js');
const catchAsync = require('./utils/catchAsync');

const Resume = require('./models/resume');

const mainPagesRoutes = require('./routes/mainPages');
const reviewsRoutes = require('./routes/reviews');

const secret = process.env.SECRET || 'zahraisthebest';

const MongoDBStore = require('connect-mongo');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/resumeDB';

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const seedDB = catchAsync(async () => {
    await Resume.deleteMany({});
    // const random1000 = Math.floor(Math.random() * 1000);
    const resume = new Resume({
        username: 'ZahraTawab',
        password: '$2b$12$j/J8eclrbICfAXgnpFpjuOWUq/rIfmweo5bj.lTKVde7CpqsK9nm6',
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
});

seedDB();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));

const store = MongoDBStore.create({
    mongoUrl: dbURL,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //add it only when deploy local host is not https
        // secure: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7)
    }
}

app.use(session(sessionConfig));
app.use(flash());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://www.youtube.com/",
    "https://code.jquery.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://cdnjs.cloudflare.com/",
    "https://fonts.gstatic.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://fonts.googleapis.com/",
];
const fontSrcUrls = [
    "https://fonts.gstatic.com/",
    "https://cdnjs.cloudflare.com/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dncoqcjvv/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            frameSrc: [
                "https://www.youtube.com/",]
        },
    })
);


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', mainPagesRoutes);
app.use('/reviews', reviewsRoutes);


app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not FOUND!', 404));
});

app.use((err, req, res, next) => {
    const { message = 'Something went wrong', statusCode = 500 } = err;
    if (!err.message) err.message = 'OH NO something went wrong!'
    res.status(statusCode).render('error', { err })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on Port ${port}`)
});
