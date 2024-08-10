/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jeremy Dela Cruz Student ID: 159161223 Date: Aug 9, 2024
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const exphbs = require('express-handlebars');

var app = express();
var collegeData = require('./modules/collegeData');
var path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');

const handlebars = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + (typeof options.fn === 'function' ? options.fn(this) : '') + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (typeof options === 'object' && typeof options.fn === 'function') {
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            } else {
                return lvalue == rvalue;
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

app.get("/students/add", (req, res) => {
    collegeData.getCourses().then((courses) => {
        res.render("addStudent", { courses: courses });
    }).catch((err) => {
        res.render("addStudent", { courses: [] });
    });
});

app.get('/students', (req, res) => {
    collegeData.getAllStudents().then((data) => {
        if (data.length > 0) {
            res.render('students', { students: data });
        } else {
            res.render('students', { message: "no results" });
        }
    }).catch(() => {
        res.render('students', { message: "no results" });
    });
});

app.get("/student/:studentNum", (req, res) => {
    let viewData = {};

    collegeData.getStudentByNum(req.params.studentNum).then((student) => {
        if (student) {
            viewData.student = student;
        } else {
            viewData.student = null;
        }
    }).catch((err) => {
        viewData.student = null;
    }).then(collegeData.getCourses)
    .then((courses) => {
        viewData.courses = courses;

        for (let i = 0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.course) {
                viewData.courses[i].selected = true;
            }
        }
    }).catch((err) => {
        viewData.courses = [];
    }).then(() => {
        if (viewData.student == null) {
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData });
        }
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

app.get('/courses/add', (req, res) => {
    res.render('addCourse');
});

app.post('/courses/add', (req, res) => {
    collegeData.addCourse(req.body).then(() => {
        res.redirect('/courses');
    }).catch(err => {
        res.send("Error: " + err);
    });
});

app.post('/course/update', (req, res) => {
    collegeData.updateCourse(req.body).then(() => {
        res.redirect('/courses');
    }).catch((err) => {
        res.status(500).send("Unable to Update Course");
    });
});

app.get("/course/:id", (req, res) => {
    collegeData.getCourseById(req.params.id).then((data) => {
        if (data) {
            res.render("course", { course: data });
        } else {
            res.status(404).send("Course Not Found");
        }
    }).catch((err) => {
        res.status(404).send("Course Not Found");
    });
});

app.get('/course/delete/:id', (req, res) => {
    collegeData.deleteCourseById(req.params.id).then(() => {
        res.redirect('/courses');
    }).catch((err) => {
        res.status(500).send("Unable to Remove Course / Course not found");
    });
});

app.get('/student/delete/:studentNum', (req, res) => {
    collegeData.deleteStudentByNum(req.params.studentNum)
        .then(() => {
            res.redirect('/students');
        })
        .catch((err) => {
            res.status(500).send("Unable to Remove Student / Student not found");
        });
});

app.get('/courses', (req, res) => {
    collegeData.getCourses().then((data) => {
        if (data.length > 0) {
            res.render('courses', { courses: data });
        } else {
            res.render('courses', { message: "no results" });
        }
    }).catch(() => {
        res.render('courses', { message: "no results" });
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
