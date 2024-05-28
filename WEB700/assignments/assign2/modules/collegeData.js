class Data {
    constructor(students,courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;
const fs = require('node:fs');

function initialize(students,courses) {
    return new Promise(function(resolve,reject) {
        fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
            if (err) {
                //console.error(err);
                reject("Unable to read students.json");
                return;
            }        
            let studentDataFromFile = JSON.parse(studentData);
            fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
                if (err) {
                    //console.error(err);
                    reject("Unable to read courses.json");
                    return;
                }
                let courseDataFromFile = JSON.parse(courseData); 
                dataCollection = new Data(studentDataFromFile, courseDataFromFile);
                resolve();

            });
        }) 
    });
}

function getAllStudents() {
    return new Promise(function(resolve,reject) {
        if (dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject("No results returned");
        }
    });
}

function getTAs() {
    return new Promise(function(resolve,reject) {
        const TAs = dataCollection.students.filter(student => student.TA === true);
        if (TAs.length > 0) {
            resolve(TAs);
        } else {
            reject("no results returned");
        }
    });
}

function getCourses() {
    return new Promise(function(resolve, reject) {
        if (dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject("no results returned");
        }
    });
}

module.exports = { initialize, getAllStudents, getTAs, getCourses };