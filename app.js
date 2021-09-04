const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const name = req.body.Name;
  const email = req.body.Email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        NAME: name
      }
    }]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/b7990f78cd";
  const options = {
    method: "POST",
    auth: "tyagim30:70b0785beb519b56c50e1565a95f7d69-us6"
  }

  const request = https.request(url, options, function(response) {
    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running at port 3000.");
});
