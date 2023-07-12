require("dotenv").config();
const express = require("express");
const app = express()
const bodyparser = require("body-parser")
const port = 3000

const users = []

app.set("view engine","ejs")
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("index.ejs", {name:"Atharva"})
    // res.send("Hello World")
})

app.get("/login",function(req,res){
    res.render("login.ejs")
})

app.post("/login",function(req,res){

})

app.get("/register",function(req,res){
    res.render("register.ejs")
})

app.post("/register",function(req,res){
    
})


app.listen(port)