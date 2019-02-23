var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var express = require("express");
var router = express.Router();
var app = new express();
var bodyParser = require("body-parser");
var url = "mongodb://localhost:27017/";
var fs = require("fs");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

router.all("/",function(request,response)
{
    var received = request.body;
    console.log(received);
    var obj= {hospital_name:received.hname,h_address:received.address,h_phone:received.pno,h_id:received.id,password:received.pwd};
    //console.log(obj);
    mongoClient.connect(url,function(err,db)
    {
        if(err) throw err;
        var dbo = db.db("devsoc");
        //console.log(obj); 
        // dbo.createCollection("hospitalsdata",function(err,res)
        // {
        //     if(err) throw err;
        //     console.log(res);
        // })
        // dbo.collection("hospitalsdata").find({}).toArray(function(req,res)
        // {
        //     console.log(res);
        // });
        var obj = {doctor_id:received.id,doctor_name:received.name};
        dbo.collection("doctorsdata").insertOne(obj,function(err,res)
        {
            if(err) throw err;
           // console.log(res);
            dbo.collection("doctorsdata").find({}).toArray(function(err,res)
            {
                if(err) throw err;
                var obj =res;
               // console.log(obj);
                response.render("hospital_add_remove.ejs",{data:obj});
            });
        });
    });
});

module.exports = router;