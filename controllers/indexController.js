const db = require('../db/queries');

// POST Routes

module.exports.postRegister = async(req, res, next) => {
  console.log(req.body);
};

// GET Routes
module.exports.getIndex = async(req, res, next) => {
//   const data = await db.testQuery();
//   console.log(data[0]);
  res.render('index', {title: 'Home'});
}

module.exports.getRegister = async (req, res, next) => {
  res.render('register', { title: 'Register'} ); 
}

module.exports.getLogin = async(req, res, next) => {
  res.render('login', {title: 'Login'});
}