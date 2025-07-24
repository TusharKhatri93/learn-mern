const express = require("express");
const router = express.Router();
const {createTask,getTaskByGoal,toggleTaskStatus, deleteTask} = require("../controllers/taskcontroller");
const verifyToken = require("../middleware/authMiddleware");

router.use(verifyToken);  

router.post("/", createTask);

router.get("/:goalId", getTaskByGoal);

router.patch("/toggle/:taskId", toggleTaskStatus);

router.patch("/:taskId", deleteTask);

module.exports = router;