// const { Client } = require("pg");
// const client = new Client(
//   process.env.DATABASE_URL || "postgres://localhost:5432/fitness-dev"
// );

module.exports = {
  // ...require('./client'), // adds key/values from users.js
  ...require("./users"), // adds key/values from users.js
  ...require("./activities"), // adds key/values from activites.js
  ...require("./routines"), // etc
  ...require("./routine_activities"), // etc
};
