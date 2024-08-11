/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jeremy Dela Cruz Student ID: 159161223 Date: July 26, 2024
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const exphbs = require('express-handlebars');

var app = express();
var collegeData = require('./modules/collegeData');
var path = require('path');

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');

const handlebars = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options) {
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
});

app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use((req, res, next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/htmlDemo', (req, res) => {
    res.render('htmlDemo');
});

app.get('/students/add', (req, res) => {
    res.render('addStudent');
});

app.get('/students', (req, res) => {
    collegeData.getAllStudents().then((data) => {
        res.render('students', { students: data });
    }).catch(() => {
        res.render('students', { message: "no results" });
    });
});

app.get('/courses', (req, res) => {
    collegeData.getCourses().then((data) => {
        res.render('courses', { courses: data });
    }).catch(() => {
        res.render('courses', { message: "no results" });
    });
});

app.get("/course/:id", (req, res) => {
    collegeData.getCourseById(req.params.id).then((data) => {
        res.render("course", { course: data });
    }).catch((err) => {
        res.status(404).send("Course Not Found");
    });
});

// app.get("/tas", (req, res) => {
//     collegeData.getTAs().then((data) => {
//         res.json(data);
//     }).catch((err) => {
//         res.json({ message: err });
//     });
// });

app.get("/student/:studentNum", (req, res) => {
    let viewData = {};
    collegeData.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            viewData.student = data;
        } else {
            viewData.student = null;
        }
    }).catch(() => {
        viewData.student = null;
    }).then(collegeData.getCourses).then((data) => {
        viewData.courses = data;
        if (viewData.student == null) {
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { student: viewData.student, courses: viewData.courses });
        }
    }).catch(() => {
        viewData.courses = [];
        res.status(500).send("Unable to Show Student");
    });
});


app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body).then(() => {
        res.redirect('/students');
    }).catch(err => {
        res.send("Error: " + err);
    });
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body).then(() => {
        res.redirect("/students");
    }).catch((err) => {
        res.status(500).send("Unable to Update Student");
    });
});


app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`server listening on port: ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = app;