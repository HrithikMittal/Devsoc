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
    var obj= {doctor_id:received.id,doc_name:received.name,address:received.address,gender:received.sex,specialization:received.spec,hospital_name:received.hosp,from:received.from,to:received.to,password:received.pwd};
    mongoClient.connect(url,function(err,db)
    {
        if(err) throw err;
        var dbo = db.db("devsoc");
        
        
    });
});

module.exports = router;