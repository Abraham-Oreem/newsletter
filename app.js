const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req, res){
   res.sendFile(__dirname+"/index.html")
})

app.post("/",function(req ,res) {
    const Email=(req.body.email);
    const FirstName=(req.body.firstName);
    const SecondName=(req.body.secondName);
    var data={
        members:[
            {
                email_address :Email,
                status : "subscribed",
                merge_fields: {
                    FNAME : FirstName,
                    LNAME : SecondName
            }
            }
        ]
    };
    const JSONDATA =JSON.stringify(data);
    const url="https://APISERVER.api.mailchimp.com/3.0/lists/listID";
    const options={
        method : "POST",
        auth: "name : apikey"
    }
    const request=https.request(url, options, function(response) {
        if (response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else {
            res.sendFile(__dirname+"/fail.html");
        }
        response.on("data",function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(JSONDATA);
    request.end();
    
})

app.post("/failure", function(req ,res) {
    res.redirect("/");
} )

app.post("/success", function(req ,res) {
    res.redirect("/");
} )

app.listen(process.env.PORT || 3000,function() {
   console.log("activated"); 
});