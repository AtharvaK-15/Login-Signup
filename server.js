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
const methodoverride = require("method-override")


// storing the user information in the local storage
const users = []
const initializepassport = require("./passport-config")
initializepassport(passport,
    email => users.find(users=>users.email === email),
    id => users.find(users=>users.id === id)
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
app.use(methodoverride("_method"))

app.get("/", checkAuthenticated ,function(req,res){
    res.render("index.ejs", {name:req.user.name})
    // res.send("Hello World")
})

app.get("/login",checkNotAuthenticated,function(req,res){
    res.render("login.ejs")
})

app.post("/login",checkNotAuthenticated,passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true
}))

app.get("/register",checkNotAuthenticated,function(req,res){
    res.render("register.ejs")
})

app.post("/register",checkNotAuthenticated,async function(req,res){
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

// loggin out the user:

app.delete("/logout", (req, res) => {
    req.logOut(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/login");
    });
  });

// middleware function to restrict user without login to access homepage
// here, iseuthenticated is a built-in passportjs function.
function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

// if user is already logged in, dont allow him to go to the login page again
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
       return res.redirect("/")
    }
    return next()
}

app.listen(port)