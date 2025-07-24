const Goal = require("../models/Goal");

const createGoal = async (req, res) => {
    const { title } = req.body;
    const uid = req.user.uid;

    if (!title || !uid) {
        return res.status(400).json({ message: "Title and userId is required" });
    }

    try {
        const goal = await Goal.create({ title, uid });
        res.status(200).json(goal);
    }
    catch (err) {
        console.error("Error creating goal : " + err.message);
        res.status(500).json({ message: "Server error" });
    }
};


const goalsByUser = async (req, res) => {
    try {
        const goals = await Goal.find({ uid: req.user.uid }).sort({ createdAt: -1 });
        res.status(200).json(goals);
    }
    catch (err) {
        console.error("Error fetching user goals : " + err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteGoal = async (req, res) => {
    const { goalId } = req.params;

    try {
        const goal = await Goal.findById(goalId);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        await goal.deleteOne();
        res.status(200).json({ message: "Goal deleted successfully" });
    } catch (err) {
        console.error("Error deleting goal:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { createGoal, goalsByUser, deleteGoal };
