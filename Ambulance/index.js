var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var request = require("request");
var MongoClient = require("mongodb").MongoClient;
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.set("view engine", "ejs");
app.use(express.static("public"));

url = "mongodb://localhost:27017/devsoc";

// Todo:get details from Cookies

MongoClient.connect(url, (err, db) => {
    const dbo = db.db("devsoc");

    //API Routes
    var router = express.Router();

    // Route to view all the requests
    app.get("/", function (req, res) {
        dbo
            .collection("ambulancedetail")
            .find({})
            .toArray(function (err, result) {
                console.log(err);
                res.render("viewall", {
                    title: "View all requests",
                    data: result
                });
            });
    });

    //post route for completed update
    app.get("/requests/:id/completed", function (req, res) {
        dbo
            .collection("ambulancedetail")
            .find({})
            .toArray(function (err, result) {
                let id = req.params.id;
                console.log(id);
                for (i = 0; i < result.length; i++) {
                    if (result[i]._id == id) {
                        console.log("Hello");
                        mynew = {
                            $set: {
                                _id: id,
                                name: result[i].name,
                                age: result[i].age,
                                phone: result[i].phone,
                                sex: result[i].sex,
                                location: result[i].location,
                                completed: 1,
                                diseaseHistory: result[i].diseaseHistory
                            }
                        };
                        myold = {
                            _id: id
                        };
                        console.log(myold);
                        console.log(mynew);
                        dbo
                            .collection("ambulancedetail")
                            .updateOne(myold, mynew, {
                                upsert: true
                            }, function (err, result) {
                                console.log("Hello chnages is happen");
                                res.redirect("/");
                            });
                    }
                }
            });
    });
});
app.listen("3004", "127.0.0.1", function () {
    console.log("Server is listening on port 3004!");
});