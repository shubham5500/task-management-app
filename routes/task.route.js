const express = require("express");
const { validateTask } = require("../models/task.model");
const { ErrorHandler } = require("../error/error.helper");
const { error } = require("winston");
const { createTask, getTaskDetailById, moveTask } = require("../db/task.db");

const taskRoute = express.Router();

// Add routes
taskRoute.get("/", async (req, res) => {});

taskRoute.get("/:taskId", async (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const taskDetail = await getTaskDetailById(taskId);
  res.status(200).send(taskDetail);
});

taskRoute.post("/create", async (req, res) => {
  const body = req.body;
  const {
    title,
    description,
    status,
    priority,
    createdBy,
    assignedTo,
    position,
    listId,
  } = body;

  const validatedTask = validateTask({
    title,
    description,
    status,
    priority,
    createdBy,
    assignedTo,
    position,
    listId,
  });

  if (validatedTask.error) {
    throw new ErrorHandler(400, validatedTask.error);
  }

  await createTask(body);

  return res.status(200).send("Task created successfully!");
});

taskRoute.put('/move/:taskId', async (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const {sourceListId, destinationListId, destinationIndex} = req.body;
  await moveTask({taskId, sourceListId, destinationListId, destinationIndex})
  res.send('Done!')
})

module.exports = {
  taskRoute,
};
