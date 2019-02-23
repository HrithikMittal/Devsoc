var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Details = require("./app/models/details");
var MongoClient = require("mongodb").MongoClient;
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");

// Configure app for bodyParser()
// lets us grab data from the body of POST
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.set("view engine", "ejs");
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.render("registration.ejs");
});



// Set up port for server to listen on
var port = process.env.PORT || 3001;

// Connect to DB
// var url = "mongodb://adhi:password123@ds141796.mlab.com:41796/signup";
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, db) => {
    const dbo = db.db("devsoc");

    //API Routes
    var router = express.Router();


    app.post("/details-update", function (req, res) {
        var exits = {
            PatientNo: req.body.PatientNo
        };

        var updatevalue = {
            PatientName: req.body.PatientName,
            PatientAddress: req.body.PatientAddress,
            PatientNo: req.body.PatientNo,
            PatientDisease: req.body.PatientDisease,
            PatientDoctor: req.body.PatientDoctor,
            PatientPassword: req.body.PatientPassword,
        };
        console.log(exits);
        console.log(updatevalue);
        dbo
            .collection("details")
            .updateMany(exits, updatevalue, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
    });


    app.post("/details", function (req, res) {
            let status = true;
            let pswd = CryptoJS.AES.encrypt(req.body.PatientPassword, 'devsockey');
            var person = new Details();
            person.PatientName = req.body.PatientName;
            person.PatientSex = req.body.PatientSex;
            person.PatientDob = req.body.PatientDob;
            person.PatientAddress = req.body.PatientAddress;
            person.PatientNo = req.body.PatientNo;
            person.PatientDisease = req.body.PatientDisease;
            person.PatientDoctor = req.body.PatientDoctor;
            person.PatientPassword = pswd;

            dbo
                .collection("details")
                .find({})
                .toArray(function (err, result) {
                    if (err) throw err;
                    for (var i = 0; i < result.length; i++) {
                        if (person.PatientNo == result[i].PatientNo) {
                            status = false;
                            console.log(status);
                        }
                    }
                    console.log(status);
                    if (status == true) {
                        dbo.collection("details").insertOne(person, function (err, res) {
                            if (err)
                                throw {
                                    message: "Error comes " + err.message
                                };
                            console.log("1 document inserted sucessfully");
                            // res.send do not work here
                        });
                    }
                    res.render("login");
                    return status;
                });
        })
        .get(function (req, res) {
            dbo
                .collection("details")
                .find({})
                .toArray(function (err, result) {
                    if (err) throw err;
                    console.log(result);
                    db.close();
                });
            res.send("done");
        });


    app.post("/patientlogin", function (req, res) {
        var person = new Details();
        person.PatientNo = req.body.PatientNo;
        person.PatientPassword = req.body.PatientPassword;
        person.PatientName = req.body.PatientName;
        dbo.collection("details").find({}).toArray(function (err, result) {
            if (err) throw err;
            else {
                console.log(result);
                for (i = 0; i < result.length; i++) {

                    //    var dbPassDec = result[i].PatientPassword;
                    var bytes = CryptoJS.AES.decrypt(result[i].PatientPassword.toString(), 'devsockey');
                    var dbPassDec = bytes.toString(CryptoJS.enc.Utf8);
                    if ((result[i].PatientNo == person.PatientNo) && (dbPassDec == person.PatientPassword)) {
                        console.log(`User is Authenticated Congo!`);
                        res.redirect("http://localhost:3003");
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