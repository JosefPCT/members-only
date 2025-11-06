const db = require('../db/queries');

module.exports.getIndex = async(req, res, next) => {
  const data = await db.testQuery();
  console.log(data[0]);
  res.render('index');
}