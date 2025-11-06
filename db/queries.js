const pool = require('./pool');


module.exports.testQuery = async() => {
  const sql = `
    SELECT *
    FROM test;
  `;

  const { rows } = await pool.query(sql);
  return rows;
}