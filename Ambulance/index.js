var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var request = require("request");
var MongoClient = require("mongodb").MongoClient;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static('public'));

url = 'mongodb://localhost:27017/devsoc';

// Todo:get details from Cookies

MongoClient.connect(url, (err, db) => {
    const dbo = db.db("devsoc");

    //API Routes
    var router = express.Router();
    // Index page route
    app.get('/', function (req, res) {
        res.render('index', {
            title: "Emergency!"
        });
    });
    // Route to view all the requests
    app.get('/requests/view', function (req, res) {
        dbo.collection("ambulancedetail").find({}, function (err, allDetils) {
            res.render('viewall', {
                title: "View all requests",
                data: allDetils
            });
        });
    });


});
app.listen('3003', '127.0.0.1', function () {
    console.log('Server started!');
});