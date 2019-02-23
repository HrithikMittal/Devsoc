var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var express = require("express");
var router = express.Router();
var app = new express();
var bodyParser = require("body-parser");
var url = "mongodb://localhost:27017/";
var fs = require("fs");
var register = require("./register.js");
var hospitalsreg = require("./hospitalsreg.js");
var hospitallogin = require("./hospitallogin.js");
var add_doctor = require("./add_doctor.js");
app.set("view engine","ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));
app.all("/",function(req,res)
{
    res.render("hospital.ejs");
});
app.all("/reg",function(request,response)
{
    response.render("hospital.ejs");
});
app.use("/register",register);
app.use("/hospitalsreg",hospitalsreg);
app.use("/hospitallogin",hospitallogin);
app.use("/add_doctor",add_doctor);
app.get("/add_remove",function(req,res)
{
    res.render("hospital_add_remove.ejs");
});
app.listen(3000);