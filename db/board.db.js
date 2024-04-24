const { db } = require("./connection");

async function createBoard({ title, description = "" }) {
  return db.none("insert into boards(title) values($1)", [title]);
}

module.exports = {
  createBoard,
};
