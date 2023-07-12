const { authenticate } = require("passport")

const localstrategy = require("passport-local").Strategy

function initialize(passport){
    const authenticateuser = function(email,password,done){
        const user = getUserByEmail(email)
        if(email == null){
            return done(null,false,{message:"No user with that email"})
        }
    }
    
    passport.use(new localstrategy({
        usernameField:"email"
    }),authenticateuser)

    passport.serializeUser(function(user,done){

    })
    passport.deserializeUser(function(id,done){

    })
}