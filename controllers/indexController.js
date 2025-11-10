const passport = require('passport');
const { body, validationResult, matchedData } = require("express-validator");

const db = require('../db/queries');
const utils = require('./utils/passwordUtils');
const { isAuth, isAdmin } = require('./utils/authMiddleware');

require('dotenv').config();


// Validation

const emptyErr = `must not be empty`;
const notSamePassErr = `Password field and Confirm Password field must be the same`;
const emailAlreadyExistsErr = `Email already exists.`;

const isSamePass = (value, { req }) => {
  if(value !== req.body.password){
    throw new Error(notSamePassErr)
  }
  return true;
}

const emailExists = async (value) => {
  const data = await db.findUserByEmail(value);
  if(data){
    throw new Error(emailAlreadyExistsErr);
  }
  return true;
}

const isCorrectSecret = (value) => {
  if(value !== process.env.SECRET){
    throw new Error('Incorrect secret');
  }
  return true;
}

const validateUser = [
  body("email").trim()
  .notEmpty().withMessage(`Email field ${emptyErr}`)
  .normalizeEmail()
  .isEmail().withMessage(`Email must be a valid email`)
  .custom(emailExists),
  body("password").trim()
  .notEmpty().withMessage(`Password field ${emptyErr}`),
  body("confirm_password").trim()
  .notEmpty().withMessage(`Confirm Password field ${emptyErr}`)
  .custom(isSamePass),
  body("first_name").trim()
  .notEmpty().withMessage(`First name field ${emptyErr}`),
  body("last_name").trim()
  .notEmpty().withMessage(`Last name field ${emptyErr}`),
  body("admin").trim()
  .optional()
];

const validateSecret = [
  body("secret").trim()
  .notEmpty().withMessage(`Secret field ${emptyErr}`)
  .custom(isCorrectSecret)
]

// POST Routes

module.exports.postRegister = [
  validateUser,
  async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).render('register', {
        title: 'Register',
        errors: errors.array()
      });
    }

    const { email, password, first_name, last_name, admin } = matchedData(req);

    const hashedPassword = await utils.genPassword(password);
    const hash = hashedPassword.hash;

    if(admin){
      await db.insertUser(first_name, last_name, email, hash, true, true)
    } else {
      await db.insertUser(first_name, last_name, email, hash);
    }

    res.redirect('/login');
  }
];

module.exports.postLogin = [
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/login-success'
  })
];

module.exports.becomeMemberPostRoute = [
  isAuth,
  validateSecret,
  async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).render('becomeMember', {
        title: 'Become a member',
        errors: errors.array()
      });
    }
    const user = req.user;
    await db.updateMemberStatusByUserId(user.id);
    res.redirect('/');
  }
]

module.exports.newMessagePostRoute = [
  isAuth,
  async(req, res, next) => {

    const { title, message_data } = req.body;
    const message = await db.insertAndReturnNewMessage(title, message_data);
    await db.insertRelationUserAndMessage(req.user.id, message.id);
    res.redirect('/');
  }
]



// GET Routes

module.exports.protectedGetRoute = [
  isAuth,
  (req, res, next) => {
    res.send("You made it to the route");
  }
]

module.exports.adminGetRoute = [
  isAdmin,
  (req, res, next) => {
    res.send("You made it to the admin route");
  }
]

module.exports.logoutGetRoute = (req, res, next) => {
  // req.logout();
  // `req.logout()` is now asynchronous now needs a callback
  req.logout((err) => {
    if(err) { return next(err); }
    // res.redirect('/protected-route');
    res.redirect('/');
  });
}

module.exports.getIndex = async(req, res, next) => {
  const isAuthenticated = req.isAuthenticated();

  const messages = await db.getAllMessagesAndUsers();

  res.render('index', {
    title: 'Home',
    user: req.user,
    isAuthenticated,
    messages
  });
}

module.exports.getRegister = async (req, res, next) => {
  res.render('register', { title: 'Register'} ); 
}

module.exports.getLogin = async(req, res, next) => {
  res.render('login', {title: 'Login'});
}

module.exports.loginSuccessGetRoute = (req, res, next) => {
  console.log('Success, showing user');
  console.log(req.user);
  res.redirect('/');
  // res.redirect(`/user/${req.user.id}`);
  // res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'); 
}

module.exports.loginFailureGetRoute = (req, res, next) => {
  res.send('You entered the wrong password.');
}

module.exports.becomeMemberGetRoute = [
  isAuth,
  (req, res, next) => {
    res.render('becomeMember', {title: 'Become a member'});
  }
]

module.exports.newMessageGetRoute = [
  isAuth,
  (req, res, next) => {
    res.render('newMessage', {title: 'New Message'});
  }
]
