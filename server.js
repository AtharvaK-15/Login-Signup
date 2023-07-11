require("dotenv").config();
const express = require("express");
const app = express()
const bodyparser = require("body-parser")
const port = 3000

app.set("view engine","ejs")
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("index.ejs")
    // res.send("Hello World")
})

app.listen(port)