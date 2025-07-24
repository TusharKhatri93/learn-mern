const Task = require("../models/Task");

const createTask = async (req, res) => {
    const { title, goalId, dueDate } = req.body;
    const uid = req.user.uid;

    if (!goalId || !title) {
        return res.status(400).json({ message: "goalId and title required" });
    }

    try {
        const task = await Task.create({ uid, title, goalId, dueDate });
        res.status(200).json(task);
    }
    catch (err) {
        console.log("Error creating task : " + err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const getTaskByGoal = async (req, res) => {
    const { goalId } = req.params;

    try {
        const task = await Task.find({ goalId }).sort({ createdAt: -1 });
        res.status(200).json(task);
    }
    catch (err) {
        console.log("Error fetching the task");
        res.status(500).json({ message: "Server error" });
    }
};

const toggleTaskStatus = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.completed = !task.completed;
        await task.save();
        res.status(200).json(task);
    }
    catch (err) {
        console.log("Error toggling the task");
        res.status(500).json({ message: "Server error" });
    }
};

const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne();
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (err) {
        console.log("Error deleting the task:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { getTaskByGoal, createTask, toggleTaskStatus, deleteTask };