const { authenticate } = require("passport")
const bcrypt = require("bcrypt")

const localstrategy = require("passport-local").Strategy

function initialize(passport,getUserByEmail, getUserById){
    const authenticateuser =async function(email,password,done){
        const user = getUserByEmail(email)
        if(user == null){
            return done(null,false,{message:"No user with that email"})
        }

        try {
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else{
                return done(null,false,{message:"Password incorrect"})
            }
        } catch (e) {
             return done(e)
        }
    }
    
    passport.use(new localstrategy({
        usernameField:"email"
    },authenticateuser))

    passport.serializeUser(function(user,done){
        done(null,user.id)
    })
    passport.deserializeUser(function(id,done){
        return done(null,getUserById(id))
    })
}

module.exports = initialize