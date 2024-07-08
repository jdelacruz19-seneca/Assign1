/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jeremy Dela Cruz Student ID: 159161223 Date: July 5, 2024
*
*  Online (vercel) Link: ________________________________________________________
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var collegeData = require('./modules/collegeData');
var path = require('path');


// setup a 'route' to listen on the default url path
// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});

app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "views/addStudent.html"));
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json({ message: err });
        });
    } else {
        collegeData.getAllStudents().then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json({ message: err });
        });
    }
});

app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({ message: err });
    });
});

app.get("/tas", (req, res) => {
    collegeData.getTAs().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({ message: err });
    });
});

app.get("/courses", (req, res) => {
    collegeData.getCourses().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({ message: err });
    });
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body).then(() => {
        res.redirect('/students');
    }).catch(err => {
        res.send("Error: " + err);
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
