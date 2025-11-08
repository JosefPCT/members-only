const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const pool = require('../db/pool'); // Maybe change to queries for the query needed instead of directly using pool
const db = require('../db/queries');
const utils = require('../controllers/utils/passwordUtils');

// Custom form field names besides the default 'username' and 'password' can be defined as a custom field
const customFields = {
  usernameField: 'email',
  passwordField: 'password'
};

// This callback will be used when calling 'passport.authenticate()'
// Checks if user exists and checks if login credentials are valid
const verifyCallback = async(username, password, done) => {

  try {
    const user = await db.findUserByEmail(username);

    if(!user) {
        return done(null, false, { message: "Incorrect username"} );
    }

    // Instead of using a separate function to rehash the login password to compare to the stored hashed password in the db
    // Use the checker function .compare to automatically verify the inputted login password to the hashed store
    // const isValid = await bcrypt.compare(password, user.hash);
    const isValid = await utils.validatePassword(password, user.hash);

    if(isValid){
        return done(null, user)
    } else {
        return done(null, false,  { message: "Incorrect password" });
    }

  } catch (err) {
    return done(err);
  }

}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async(userId, done) => {
  try{
    const user = await db.findUserById(userId);

    if(user){
        done(null, user);
    } 
  } catch(err){
    done(err);
  }
});