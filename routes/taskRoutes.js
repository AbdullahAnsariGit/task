const express = require("express");
const {
  createTask,
  fetchTasks,
  fetchSingleTask,
  updateTask,
  removeTask,
} = require("../controllers/taskControllers");
const verifyToken = require("../middlewares/authenticate");

const routers = express.Router();

routers.get("/fetch-tasks", fetchTasks);
routers.post("/create-task", createTask);
routers.get("/fetch-single-task/:id", fetchSingleTask);
routers.patch("/update-task/:id", verifyToken, updateTask);
routers.patch("/remove-task/:id", verifyToken, removeTask);

module.exports = routers;
