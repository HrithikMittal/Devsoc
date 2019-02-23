var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var request = require("request");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/emergency');
// Defining emergency request schema
var emergencySchema = new mongoose.Schema({
    name: String,
    age: String,
    phone: String,
    location: String,
    sex: String,
    isCompleted: String
},{ versionKey: false });

//Defining the collection with emergencySchema
var Detail = mongoose.model('Detail', emergencySchema);

// Index page route
app.get('/',function(req,res){
    res.render('index',{title: "Emergency!"});
});

//Confirmation page route
app.get('/requests/success', function(req,res){
    res.render('success',{title: "Emergency request submitted successfully!"});
});
//Failed page route
app.get('/requests/failed', function(req,res){
    res.render('failed',{title: "Some error occured!"});
});
// Route to view all the requests
app.get('/requests/view', function(req,res){
    Detail.find({}, function(err, allDetils){
        res.render('viewall',{title: "View all requests", data: allDetils});
    });
});
// Post request with the details of the emergency and using the Google Maps API to get location details
app.post('/requests/new', function(req,res){
    // var name = req.body.name;
    // var age = req.body.age;
    // var phone = req.body.phone;
    // var sex = req.body.sex;
    // var location = req.body.location;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var locationName=undefined;
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&sensor=true&key=AIzaSyACjEFG5Hufa0S1NlDL1IH0bphLn334Ciw";
    request(url, function(error,response,body){
    if(!error && response.statusCode == 200){
        var locationDetails = JSON.parse(body);
        locationName = locationDetails["results"][0]["formatted_address"];
        var data = {
            name: req.body.name,
            age: req.body.age,
            phone: req.body.phone,
            sex: req.body.sex,
            location: locationName,
            isCompleted: 0
        }
        Detail.create(data, function(err,detail){
            if(err){
                console.log(err);
            } else{
                console.log(detail);
            }
        });
        res.redirect('/requests/success');
    }else{
        // console.log("Something went wrong!");
        res.redirect('/requests/failed');
    }
});
});

app.get("/requests/:id/completed", function(req,res){
    let id = req.params.id;
    Detail.update({_id: id}, {$set: {isCompleted: '1'}}, function(err,result){
        res.redirect("/requests/view");
    });
    
});

app.listen('3000','127.0.0.1',function(){
    console.log('Server started!');
});


// Google Maps API Key: AIzaSyACjEFG5Hufa0S1NlDL1IH0bphLn334Ciw