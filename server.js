var express = require("express");
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(session({
  secret: 'wepogsresal',
  resave: false,
  saveUninitialized: true
}))

app.set('views', __dirname + '/views');
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(request, response){
    //checking for first timers
    if(!("total" in request.session)){
        request.session.total = 0
        request.session.messages = []
    }

    var data = {
        "total" : request.session.total,
        "messages" : request.session.messages
    }

    response.render("index", data)
})

app.post("/process/:location", function(request, response){
    var gold = 0;
    var location = request.params.location

    switch(location){
    case "Farm":
        gold = Math.floor(Math.random()*10)+10;
        break;
    case "Cave":
        gold  = Math.floor(Math.random()*5)+5;
        break;
    case "House":
        gold  = Math.floor(Math.random()*3)+2;
        break;
    case "Casino":
        gold  = Math.floor(Math.random()*100)-50;
        break;
    }

    request.session.total += gold
    request.session.messages.push({"gold":gold , "location": location})

    response.redirect("/")
})

app.get("/reset", function(request, response){
    request.session.destroy();
    response.redirect("/")
})

app.listen(8000, function() {
  console.log("listening on port 8000");
})
