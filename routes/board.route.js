const { createBoard } = require("../db/board.db");

const express = require("express");
const { validateBoard } = require("../models/board.model");

const boardRoute = express.Router();

boardRoute.get("/", (req, res) => {});

boardRoute.post("/create", async (req, res) => {
  const body = req.body;
  const validatedBoard = validateBoard(body);

  if (validatedBoard.error) {
    throw new Error(400, validatedBoard.error);
  }

  await createBoard(body);

  return res.status(200).send("Board created successfully!");
});

module.exports = {
    boardRoute
}
