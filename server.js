require("dotenv").config();
const express = require("express");
const app = express()
const bodyparser = require("body-parser")
const port = 3000
// bcrypt is a js library used for hashing passwords
const bcrypt = require("bcrypt");
const passport = require("passport");

// storing the user information in the local storage
const users = []
const initializepassport = require("./passport-config")
initializepassport(passport)

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

app.post("/register",async function(req,res){
    try {
        const hashedpassword = await bcrypt.hash(req.body.password,10);
        users.push({
            id:Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            password:hashedpassword
        })
        res.redirect("/login")
    } catch {
        res.redirect("/register")
    }
    console.log(users);
})


app.listen(port)