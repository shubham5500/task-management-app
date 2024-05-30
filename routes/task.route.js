const express = require("express");
const { isEmpty } = require("lodash");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

const { validateTask, validateTaskFile } = require("../models/task.model");
const { ErrorHandler } = require("../error/error.helper");
const multer = require("multer");
const path = require("path");

const {
  createTask,
  getTaskDetailById,
  updateTaskById,
  deleteTask,
  getAllTask,
  moveTask,
  commentOnTask,
} = require("../db/task.db");
const { validateComment } = require("../models/comment.model");

const taskRoute = express.Router();
const s3 = new AWS.S3({
  accessKeyId: "AKIATCKAOYTWC372OHFF",
  secretAccessKey: "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",
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "new-free-bucket",
    metadata: function (req, file, cb) {
      console.log({ req });
      cb(null, file.filename);
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

// Add routes
taskRoute.get("/", async (req, res) => {
  const tasks = await getAllTask();
  return res.status(200).send(tasks);
});

taskRoute.get("/:taskId", async (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const taskDetail = await getTaskDetailById(taskId);
  res.status(200).send(taskDetail);
});

taskRoute.post("/create", upload.single("taskFiles"), async (req, res) => {
  const file = req.file || {};
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

  if (!isEmpty(file)) {
    const validtedTaskFile = validateTaskFile({
      fileUrl: file.location,
      uploadedBy: 1 || req.user.id,
    });

    if (validtedTaskFile.error) {
      throw new ErrorHandler(400, validatedTask.error);
    }
  }

  if (validatedTask.error) {
    throw new ErrorHandler(400, validatedTask.error);
  }

  const result = await createTask({
    title,
    description,
    status,
    priority,
    createdBy,
    assignedTo,
    position,
    fileUrl: file.location,
    listId,
  });

  return res.status(200).send(result);
});

taskRoute.patch("/:taskId", async (req, res) => {
  // assigned_to_id
  const taskId = parseInt(req.params.taskId);

  await updateTaskById(req.body, taskId);
  return res.status(200).send(req.body);
});

taskRoute.post("/:taskId/comment", async (req, res) => {
  const body = req.body;
  const {taskId} = req.params;
  // const { userId } = req.user; // todo: remove the OR sign
  const { text } = body;
  const validateCommentObj = validateComment({ text });

  if (validateCommentObj.error) {
    throw new ErrorHandler(403, validateCommentObj.error);
  }

  const result = await commentOnTask(taskId, 3, {text})
  return res.status(200).send({message: 'Create Successfully!', result})
});

taskRoute.put("/move", async (req, res) => {
  /*
     {
        id: index,
        id: index,
        id: index,
        id: index,
    }
  */

  const body = req.body;
  await moveTask(body);
  const tasks = await getAllTask();
  return res.status(200).send(tasks);
});

taskRoute.delete("/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  await deleteTask(taskId);
  return res.status(200).send("Deleted successfully!");
});

module.exports = {
  taskRoute,
};
