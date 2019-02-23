var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var express = require("express");
var router = express.Router();
var app = new express();
var bodyParser = require("body-parser");
var url = "mongodb://localhost:27017/";
var fs = require("fs");

app.use(bodyParser.urlencoded({extended:true}));

router.all("/",function(request,response)
{
    var received = request.body;
    console.log(received);
    var obj= {hospital_name:received.hname,h_address:received.address,h_phone:received.pno,h_id:received.id,password:received.pwd};
    mongoClient.connect(url,function(err,db)
    {
        if(err) throw err;
        var dbo = db.db("devsoc");
        console.log(obj); 
        // dbo.createCollection("hospitalsdata",function(err,res)
        // {
        //     if(err) throw err;
        //     console.log(res);
        // })
        dbo.collection("hospitalsdata").insertOne(obj,function(err,res)
        {
            if(err) throw err;
            console.log(res);
            response.redirect("/");  
        })
    });
});

module.exports = router;