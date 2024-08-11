const Sequelize = require('sequelize');
require('pg'); // explicitly require the "pg" module

var sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'y5Wr9iMYkFod', {
    host: 'ep-flat-voice-a5not18r.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    query: {
        raw: true
    }
});

const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                console.log("Database sync successful");
                resolve();
            })
            .catch((err) => {
                console.log("Database sync error: " + err);
                reject("unable to sync the database");
            });
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        Student.findAll()
            .then(data => resolve(data))
            .catch(() => reject("query returned 0 results"));
    });
}

module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { course: course }
        })
            .then(data => resolve(data))
            .catch(() => reject("query returned 0 results"));
    });
}

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { studentNum: num }
        })
            .then(data => {
                if (data.length > 0) {
                    resolve(data[0]);
                } else {
                    reject("query returned 0 results");
                }
            })
            .catch(() => reject("query returned 0 results"));
    });
}

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        Course.findAll()
            .then(data => resolve(data))
            .catch(() => reject("query returned 0 results"));
    });
}

module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where: { courseId: id }
        })
            .then(data => {
                if (data.length > 0) {
                    resolve(data[0]);
                } else {
                    reject("query returned 0 results");
                }
            })
            .catch(() => reject("query returned 0 results"));
    });
}

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = (studentData.TA) ? true : false;

        for (let prop in studentData) {
            if (studentData[prop] === "") studentData[prop] = null;
        }

        Student.create(studentData)
            .then(() => resolve())
            .catch(() => reject("unable to create student"));
    });
}

module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = (studentData.TA) ? true : false;

        for (let prop in studentData) {
            if (studentData[prop] === "") studentData[prop] = null;
        }

        Student.update(studentData, {
            where: { studentNum: studentData.studentNum }
        })
            .then(() => resolve())
            .catch(() => reject("unable to update student"));
    });
}

module.exports.addCourse = (courseData) => {
    return new Promise((resolve, reject) => {
        for (let prop in courseData) {
            if (courseData[prop] === "") {
                courseData[prop] = null;
            }
        }

        Course.create(courseData)
            .then(() => {
                resolve("Course created successfully.");
            })
            .catch((err) => {
                reject("Unable to create course: " + err);
            });
    });
};

module.exports.updateCourse = (courseData) => {
    return new Promise((resolve, reject) => {
        for (let prop in courseData) {
            if (courseData[prop] === "") {
                courseData[prop] = null;
            }
        }

        Course.update(courseData, {
            where: {
                courseId: courseData.courseId
            }
        })
        .then(() => {
            resolve("Course updated successfully.");
        })
        .catch((err) => {
            reject("Unable to update course: " + err);
        });
    });
};

module.exports.deleteCourseById = (id) => {
    return new Promise((resolve, reject) => {
        Course.destroy({
            where: {
                courseId: id
            }
        })
        .then(() => {
            resolve("Course deleted successfully.");
        })
        .catch((err) => {
            reject("Unable to delete course: " + err);
        });
    });
};

module.exports.deleteStudentByNum = function(studentNum) {
    return new Promise((resolve, reject) => {
        Student.destroy({
            where: { studentNum: studentNum }
        })
        .then((rowsDeleted) => {
            if (rowsDeleted > 0) {
                resolve();
            } else {
                reject("Student not found");
            }
        })
        .catch((err) => {
            reject("Unable to remove student: " + err);
        });
    });
};