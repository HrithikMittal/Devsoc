var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Details = require("./app/models/details");
var MongoClient = require("mongodb").MongoClient;
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
cookieParser = require('cookie-parser');
var request = require("request");
app.use(express.static("public"));
app.use(cookieParser());

// Configure app for bodyParser()
// lets us grab data from the body of POST
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.set("view engine", "ejs");
app.use(bodyParser.json());



// Set up port for server to listen on
var port = process.env.PORT || 3001;


app.get("/", function (req, res) {
    res.render("registration.ejs");
});

app.get("/requests/success", function(req, res) {
    res.render("success.ejs", {
    title: "Emergency request submitted successfully!"
    });
});

app.get("/requests/failed", function(req, res) {
    res.render("failed.ejs", {
    title: "Some error occured!"
    });
});

app.post("/requests/new", function(req, res) {
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var PatientNumber = req.cookies.userMob;
// take patientNo  from the cookies
    // console.log(latitude);
    // console.log(longitude);
    // console.log(PatientNumber);
//console.log(typeof PatientNo);
var url2 =
    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    latitude +
    "," +
    longitude +
    "&sensor=true&key=AIzaSyACjEFG5Hufa0S1NlDL1IH0bphLn334Ciw";
    request(url2, function(error, response, body) {
            if (!error && response.statusCode == 200) {
            var locationDetails = JSON.parse(body);
            locationName = locationDetails["results"][0]["formatted_address"];
            //console.log(`${locationName}`);
            MongoClient.connect(url,function(err,db)
            {
                if(err) throw err;
                var dbo = db.db("devsoc");
                dbo.collection("details").find({}).toArray(function(err,resulted)
                {
                    if(err) throw err;
                //   console.log(resulted);
                   for(var i=0;i<resulted.length;i++)
                   {
                      if(resulted[i].PatientNo == PatientNumber)
                      {
                        var inname = resulted[i].PatientName;
                        var insex = resulted[i].PatientSex;
                        var indob = resulted[i].PatientDob;
                        var innumber = resulted[i].PatientNo;
                        var inlocation = locationName;
                        var inobj = {
                          name: inname,
                          phone: innumber ,
                          age: indob ,
                          sex: insex,
                          location: inlocation,
                          isCompleted:"0"
                        }; 
                       console.log(inobj);
                        dbo.collection("ambulancedetails").insertOne(inobj,function(err,rr)
                        {
                          if(err) throw err;
                        //   console.log(rr);
                        });
                      }
                   }

                });
                
            });
        } 
        
        else {
        console.log(error);
        }
        res.render("success", { title: "Success" });
    });
});


// Connect to DB
// var url = "mongodb://adhi:password123@ds141796.mlab.com:41796/signup";
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, db) => {
    const dbo = db.db("devsoc");


    app.get("/emergency",function(req,res){
        var mobileCookie = (req.cookies.userMob);
        console.log("Cookie: "+mobileCookie);
        mobileCookie = parseInt(mobileCookie);
        dbo
            .collection("details")
            .find({"PatientNo": mobileCookie})
            .toArray(function(err, result) {
                if(err) throw err;
                // console.log(result);
                res.render("index.ejs",{data: result});
            });
        
    });
    
    app.get("/login",function(req,res){
        res.render("login");
    });

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
        var t = 0;
        var person = new Details();
        person.PatientNo = req.body.PatientNo;
        person.PatientPassword = req.body.PatientPassword;
        person.PatientName = req.body.PatientName;
        dbo.collection("details").find({}).toArray(function (err, result) {
            if (err) throw err;
            else {
                // console.log(result);
                for (i = 0; i < result.length; i++) {

                    //    var dbPassDec = result[i].PatientPassword;
                    var bytes = CryptoJS.AES.decrypt(result[i].PatientPassword.toString(), 'devsockey');
                    var dbPassDec = bytes.toString(CryptoJS.enc.Utf8);
                    if ((result[i].PatientNo == person.PatientNo) && (dbPassDec == person.PatientPassword)) {
                        res.cookie('userMob', result[i].PatientNo);
                        t=1;
                        res.redirect("/emergency");
                    }
                }
                if(t==1)
                {
                    console.log(`User is authenitcated`);
                }
                if(t==0)
                {
                    console.log(`User is ot authenitcated`);
                    res.redirect("/login");
                }
            }
        });
    });




});
// Fire up server
app.listen(port);

// print friendly message to console
console.log("Server listening on port " + port);