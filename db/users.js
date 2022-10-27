const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const result = await client.query(
      `
    INSERT INTO users (username, password) 
    VALUES($1, $2)
    ON CONFLICT (username) DO NOTHING 
    RETURNING id, username;
    `,
      [username, password]
    );
    // console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const result = await client.query(
      `
    SELECT username FROM users WHERE username = $1 AND password =$2;
    `,
      [username, password]
    );
    // console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const result = await client.query(
      `
    SELECT id, username FROM users WHERE id = $1;
    `,
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  const {
    rows: [user],
  } = await client.query(
    `
    SELECT *
    FROM users
    WHERE username=$1;
  `,
    [userName]
  );
  return user;
}
// console.log(getUserByUsername("Bell53"));

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
