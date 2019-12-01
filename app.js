// jshint esversion: 6
// Require NPM packages
const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Send main homepage
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// Post information from form
app.post("/", function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  var data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName
    }
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us20.api.mailchimp.com/3.0/lists/" + process.env.listID + "/members",
    method: "POST",
    headers: {
      "Authorization": "mmg" + process.env.apiKey,
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(response.statusCode);
    }
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

// Initialize server on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
