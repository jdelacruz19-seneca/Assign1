/*********************************************************************************
*  WEB700 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Jeremy Dela Cruz   Student ID: 159161223   Date: May 14, 2024
*
**************************************************************************************/ 

const serverVerbs = ["GET","GET","GET","POST","GET","POST"]
const serverPaths = ["/","/about","/contact","/login","/panel","/logout"]
const serverResponses = ["Welcome to WEB700 Assignment 1",
                        "This assignment was prepared by Student Name",
                        "Student Name: Student Email",
                        "User Logged In",
                        "Main Panel",
                        "Logout Complete"]


function httpRequest(httpVerb,path) {

    let flag = 0;
    var returnString = ""; //
    
    for (i = 0; i < 6; i++ ) {
        flag = 0;
        if (serverVerbs[i] == httpVerb) {
            flag++;
        }

        if (serverPaths[i] == path) {
            flag++;
        } 

        if (flag > 1) {
            //console.log("200: " + serverResponses[i]);
            returnString = "200: " + serverResponses[i];
            break;
        }
    }

    if (flag < 2) {
        //console.log("404: Unable to process %s request for %s",httpVerb,path);
        returnString = "404: Unable to process " + httpVerb + " request for " + path;
    }
    return returnString;

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomRequest() {
    const testVerbs = ["GET","POST"]
    const testPaths = ["/","/about","/contact","/login","/panel","/logout","/randomPath1","/randomPath2"]

    let randVerb = testVerbs[getRandomInt(2)];
    let randPath = testPaths[getRandomInt(7)];

    console.log(httpRequest(randVerb,randPath));
}

function automateTests () {

    setInterval(randomRequest,1000);

}

automateTests();






