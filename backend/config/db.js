const knex = require("knex");
require("dotenv").config();

const baseConfig = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  },
  pool: {
    min: 2,
    max: 10,
  },
};

const schemas = {


  chithi: knex({
    ...baseConfig,
    connection: {
      ...baseConfig.connection,
      database: "emonaham_chithi_diyo",
    },
  }),
};

// Enhanced connection testing with more details
const testConnections = async () => {
  for (const [app, db] of Object.entries(schemas)) {
    try {
      await db.raw("SELECT 1");
      console.log(`✅ ${app} database connected successfully`);
    } catch (err) {
      console.log(`❌ ${app} database connection failed:`);
      console.log(`   Error: ${err.message}`);
      console.log(`   Host: ${db.client.config.connection.host}`);
      console.log(`   User: ${db.client.config.connection.user}`);
      console.log(`   Database: ${db.client.config.connection.database}`);
    }
  }
};

testConnections();

module.exports = schemas;