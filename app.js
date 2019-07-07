//jshint esversion: 6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {

  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;


  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsonData = JSON.stringify(data);


  var options = {
    url: 'https://us3.api.mailchimp.com/3.0/lists/7d20e4d928',
    method: "POST",
    headers: {
      "Authorization": process.env.MC_Pass,
    },
    body: jsonData
  };
  request(options, function (error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        console.log(response.statusCode);
        //res.sendFile(__dirname + "/failure.html");
            }
    }

  });

});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 5500, function () {
  console.log("Server is running on port 5500.")
});


// API Key for Mailchimp  fa0f0c31e37f9a09183f0eb9c56a7d15-us3
// mailchimp campaign ID  7d20e4d928