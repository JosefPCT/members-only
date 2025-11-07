const pool = require('./pool');


// module.exports.testQuery = async() => {
//   const sql = `
//     SELECT *
//     FROM users;
//   `;

//   const { rows } = await pool.query(sql);
//   return rows;
// }

module.exports.findUserByEmail = async(email) => {
  const sql = `
    SELECT *
    FROM users
    WHERE email = $1;
  `;

  const { rows } = await pool.query(sql, [email]);
  return rows[0];
}