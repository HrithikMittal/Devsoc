var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Details = require("./app/models/details");
var MongoClient = require("mongodb").MongoClient;
var Cookies = require('cookies');
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");

var keys = ['keyboard cat']
// Configure app for bodyParser()
// lets us grab data from the body of POST
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

// Set up port for server to listen on
var port = process.env.PORT || 3002;

// Connect to DB
// var url = "mongodb://adhi:password123@ds141796.mlab.com:41796/signup";
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, db) => {
    const dbo = db.db("devsoc");

    //API Routes
    var router = express.Router();

    // Routes will all be prefixed with /API
    app.use("/api", router);

    //MIDDLE WARE-
    router.use(function (req, res, next) {
        console.log("FYI...There is some processing currently going down");
        next();
    });

    // test route
    router.get("/", function (req, res) {
        res.json({
            message: "Welcome !"
        });
    });

    router.route("/patientlogin").post(function (req, res) {
        var person = new Details();
        person.PatientNo = req.body.PatientNo;
        person.PatientPassword = req.body.PatientPassword;
        dbo.collection("details").find({}).toArray(function (err, result) {
            if (err) throw err;
            else {
                console.log(result);
                for (i = 0; i < result.length; i++) {
//                    var dbPassDec = result[i].PatientPassword;
                    var bytes  = CryptoJS.AES.decrypt(result[i].PatientPassword.toString(), 'devsockey');
                    var dbPassDec = bytes.toString(CryptoJS.enc.Utf8);
                    if ((result[i].PatientNo == person.PatientNo) && (dbPassDec == person.PatientPassword)) {
                        console.log(`User is Authenticated Congo!`);
                        res.send(`User is Authenticated Congo!`);
                        return;
                    }
                }
                console.log(`User is Not Authenticated`);
                res.send(`User is Not Authenticated`);
                return;
            }
        });
    });


});


// Fire up server
app.listen(port);

// print friendly message to console
console.log("Server listening on port " + port);
