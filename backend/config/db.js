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

// const { Sequelize } = require("sequelize");
// const logger = require("../utils/logger");

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 3306,
//     dialect: "mysql",
//     logging:
//       process.env.NODE_ENV === "development"
//         ? (msg) => logger.debug(msg)
//         : false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//     define: {
//       timestamps: true,
//       paranoid: true, // Enable soft deletes
//       underscored: true, // Use snake_case for column names
//     },
//   }
// );

// // Test database connection
// const testConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     logger.info("Database connection established successfully");
//   } catch (error) {
//     logger.error("Unable to connect to the database:", error);
//     process.exit(1);
//   }
// };

// module.exports = {
//   sequelize,
//   testConnection,
// };
