const Task = require("../models/Task");
const User = require("../models/User");

const createTask = async (req, res) => {
  const {
    // firstName,
    // lastName,
    name,
    email,
    rollNo,
    taskName,
    taskDescription,
    repoUrl,
    hostedUrl,
  } = req.body;
  const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const githubRepoValidation =
    /^(https:\/\/|http:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
  const hostedUrlValidation =
    /^(https?:\/\/)([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/.*)?$/;

  if (!name)
    return res
      .status(422)
      .json({ status: 0, message: "Name is required" });
  // if (!lastName)
  //   return res
  //     .status(422)
  //     .json({ status: 0, message: "Last name is required" });
  if (!email)
    return res.status(422).json({ status: 0, message: "Email is required" });
  if (!email.match(emailValidation)) {
    return res
      .status(400)
      .json({ status: 0, message: "Invalid email address" });
  }
  if (!rollNo)
    return res.status(422).json({ status: 0, message: "Roll no is required" });
  if (!taskName)
    return res
      .status(422)
      .json({ status: 0, message: "Task name is required" });
  // if (!taskDescription)
  //   return res
  //     .status(422)
  //     .json({ status: 0, message: "Task description is required" });
  if (!repoUrl)
    return res
      .status(422)
      .json({ status: 0, message: "Repositories url is required" });
  if (!repoUrl.match(githubRepoValidation)) {
    return res
      .status(400)
      .json({ status: 0, message: "Invalid Repositories url" });
  }
  if (!hostedUrl)
    return res
      .status(422)
      .json({ status: 0, message: "Task hosted/live url is required" });
  if (!hostedUrl.match(hostedUrlValidation)) {
    return res
      .status(400)
      .json({ status: 0, message: "Invalid Task hosted/live url" });
  }
  try {
    const existingTask = await Task.findOne({ email });
    if (existingTask) {
      return res
        .status(409) // Conflict status code
        .json({ status: 0, message: "Email already exists" });
    }
    const task = new Task({
      // firstName,
      // lastName,
      name,
      email,
      rollNo,
      taskName,
      taskDescription,
      repoUrl,
      hostedUrl,
    });

    await task.save();
    return res
      .status(200)
      .json({ status: 1, message: "Task Created Successfully" });
  } catch (err) {
    console.log("err", err);
    return res
      .status(500)
      .json({ status: 0, message: "Internal Server Error" });
  }
};

const fetchTasks = async (req, res) => {
  const { search, page, limit, startDate, endDate } = req.query;

  let query = {};

  // Searching
  if (search) {
    query.$or = [
      {
        taskName: { $regex: search, $options: "i" }, // regex with options for make it case insensitive
      },
      {
        taskDescription: { $regex: search, $options: "i" },
      },
    ];
  }

  // Filtering
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate), // Less than
      $lte: new Date(endDate), // Greater than
    };
  }

  try {
    // Pagination
    const skip = (page - 1) * limit;
    const taskLimit = parseInt(limit);
    const allTasks = await Task.find(query)
      .skip(skip) // Skip previous pages
      .limit(taskLimit) // Limit the number of results
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order
    console.log("allTasks", allTasks);
    return res.status(200).json({
      status: 1,
      data: allTasks,
      message: "Fetch All Tasks Sucessfully",
    });
  } catch (err) {
    console.log("err", err);
    return res
      .status(500)
      .json({ status: 0, message: "Internal Server Error" });
  }
};

const fetchSingleTask = async (req, res) => {
  const taskId = req.params.id;
  console.log("Task id", taskId);
  if (!taskId) {
    return res.status(400).json({ message: "Invalid task ID format" });
  }
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return res.status(500).json({
      status: 0,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const { taskName, taskDescription, repoUrl, hostedUrl } = req.body;

  if (!taskName && !taskDescription && !repoUrl && !hostedUrl) {
    return res.status(400).json({
      message:
        "At least one field (taskName, taskDescription, repoUrl, hostedUrl) is required to update the task.",
    });
  }

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (taskName) task.taskName = taskName;
    if (taskDescription) task.taskDescription = taskDescription;
    if (repoUrl) task.repoUrl = repoUrl;
    if (hostedUrl) task.hostedUrl = hostedUrl;

    const updatedTask = await task.save();

    res.status(200).json({
      status: 1,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (err) {
    console.error("Error updating task:", err);
    return res.status(500).json({
      status: 0,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const removeTask = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(404).json({ status: 0, message: "Task not found!" });
  try {
    await Task.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ status: 1, message: "Task remove successfully" });
  } catch (err) {
    console.log("Err occurs in remove api:", err);
    return res.status(500).json({
      status: 0,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  createTask,
  fetchTasks,
  fetchSingleTask,
  updateTask,
  removeTask,
};
