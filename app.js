const express = require("express");
const session = require("express-session");
const pgStore = require('connect-pg-simple')(session);
const passport = require('passport');
const path = require('path');

const pool = require('./db/pool');
const indexRouter = require('./routes/indexRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.set('views', './views');


// Setup the parser middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Session Setup
const sessionStore = new pgStore({
  pool: pool,
  tableName: 'session'
});


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Passport Authentication

require('./config/passport');

// Has to do with serialize and deserialize of user
// Express session gives us access to the `req.session` object anything we store in the req.session object will persist into the database under the 'session' collection/table
app.use(passport.session());

// Logger Middleware

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log("Listening to Port: ", PORT);
});