require("dotenv").config();

const express = require("express");
const app = express()
const bodyparser = require("body-parser")
const port = 3000
// bcrypt is a js library used for hashing passwords
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash")
const session = require("express-session")


// storing the user information in the local storage
const users = []
const initializepassport = require("./passport-config")
initializepassport(passport,
    email => users.find(users=>users.email === email)
)

app.set("view engine","ejs")
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(flash());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get("/",function(req,res){
    res.render("index.ejs", {name:"Atharva"})
    // res.send("Hello World")
})

app.get("/login",function(req,res){
    res.render("login.ejs")
})

app.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true
}))

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