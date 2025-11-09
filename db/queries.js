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

module.exports.findUserById = async(id) => {
  const sql= `
    SELECT *
    FROM "users"
    WHERE id = $1
  `;

  const { rows }  = await pool.query(sql, [id]);
  return rows[0];
}

module.exports.insertUser = async(firstname, lastname, email, hash, isAdmin = false, isMember = false) => {
  const sql = `
    INSERT INTO "users"(firstname, lastname, email, hash, admin, member) VALUES
    ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const { rows } = await pool.query(sql, [firstname, lastname, email, hash, isAdmin, isMember]);
  return rows[0];
}

module.exports.getAllMessagesAndUsers = async() => {
  const sql = `
    SELECT *
    FROM users u
    JOIN users_messages um ON u.id = um.user_id
    JOIN messages m ON m.id = um.message_id;
  `;

  const { rows }  = await pool.query(sql);
  return rows;
}

