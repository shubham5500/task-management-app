const { db } = require("./connection");

const createList = async ({boardId, title}) => {
  return await db.query("insert into lists(title, board_id) values($1, $2)", [title, boardId]);
};

module.exports = {
  createList,
};
