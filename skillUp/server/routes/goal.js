const express = require("express");
const router = express.Router();
const {createGoal, goalsByUser, deleteGoal} = require("../controllers/goalcontroller");
const verifyToken = require("../middleware/authMiddleware");

router.use(verifyToken);  

router.post("/", createGoal);

router.get("/:uid", goalsByUser);

router.delete("/:goalId", deleteGoal);

module.exports = router;