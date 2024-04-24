const express = require("express");
const { validateList } = require("../models/list.model");
const { ErrorHandler } = require("../error/error.helper");
const { createList } = require("../db/list.db");

const listRoute = express.Router();

listRoute.post("/create", async (req, res) => {
  const body = req.body;
  const { title, boardId } = body;
  const validatedList = validateList(body);
  if (validatedList.error) {
    throw new ErrorHandler(400, validatedList.error);
  }

  await createList({ title, boardId });

  return res.status(200).send("List created successfully!");
});

module.exports = {
  listRoute,
};
