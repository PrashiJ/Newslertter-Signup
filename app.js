const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const https =  require("https");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/4fbad03043";
    const options = {
        method: "POST",
        auth: "prashi:Aee66e19667570841c62e8076bf081772-us17"
    }
    const request  = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/sucess.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/")

});



app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running at port 3000");
});

