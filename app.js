const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { dir } = require("console");
const { dirname } = require("path");

const app = express();

//relative folder for static files
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;


    //made as per requirement of mailchimps batch subscribers
    const data = {
        members: [
            {//key value according to mail chimp
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    //key according to merge feild in audience in mailchimp
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    // data is in JS form but we need JASON--Flatpack jason
    const jasonData = JSON.stringify(data);
    // console.log(firstname,lastname,email);

    // only get request...when we want to get data
    // https.get(url,function())

    //but we want to post data.....
    const url = "https://us7.api.mailchimp.com/3.0/lists/07bb4d1a26";

    const options = {
        method: "POST",
        //AUTHENICATION: 'anystring:YOUR_API_KEY'
        auth: "akash1:ce7a1a192ec73e3144c9d0bb5c8a9fa8-us7"
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
            // res.send("success");
        }
        else {
            res.sendFile(__dirname+"/failure.html");
            // res.send("failed");

        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    })

    request.write(jasonData);
    request.end();
});


app.post("/failure", function (req, res) {
    res.redirect("/")
  })

//   process.env.PORT || 
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running");
});

//API
//ce7a1a192ec73e3144c9d0bb5c8a9fa8-us7

//mailchimp id audience or list id...helps mailchimp identify list that you 
// put your subscriber into
// 07bb4d1a26