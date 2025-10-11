const knex = require("knex");

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "admin",
    database: process.env.DB_NAME || "chithi_diyo",
  },
  pool: { min: 0, max: 10 },
});

module.exports = db;