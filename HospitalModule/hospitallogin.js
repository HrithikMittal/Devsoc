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
    var obj = {h_id:received.id,password:received.pwd};
    mongoClient.connect(url,function(err,db)
    {
        if(err) throw err;
        var dbo = db.db("devsoc");
        console.log(obj);
        dbo.collection("hospitalsdata").find(obj).toArray(function(err,res)
        {
            if(err) throw err;
            console.log(res);
            console.log(res.length);
            if(res.length>0)
            {
                response.render("doctors_list.ejs",{data:obj});
            }
        });
        
    });
});

module.exports = router;