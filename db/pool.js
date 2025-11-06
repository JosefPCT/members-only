const { Pool } = require("pg")

require('dotenv').config();

module.exports = new Pool({
  host: process.env.DATABASE_HOST, // or wherever the db is hosted
  user: process.env.DATABASE_USER, // role name
  database: process.env.DATABASE_NAME, // database name
  password: process.env.DATABASE_PASSWORD, //role password
  port: process.env.DATABASE_PORT // The default port
});