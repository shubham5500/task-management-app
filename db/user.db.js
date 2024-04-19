const { db } = require("./connection");

async function creatUser({ name, email, username, password }) {
  const res = await db.one("insert into users(email, username, password, name) values($1, $2, $3, $4) returning *", [
    email,
    username,
    password,
    name
  ]);
  return res;
}

async function getUserByKey(keyName, value) {
  return await db.one(`select id, username, email, name, role, password from users where ${keyName}=$1;`, [value])
}

async function getUserById(userId) {
  return await db.one('select * from users where id=$1', [userId]);
}


module.exports = {
    creatUser,
    getUserByKey,
    getUserById,
}