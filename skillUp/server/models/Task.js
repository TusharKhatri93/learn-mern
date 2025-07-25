const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    goalId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    completed:{
        type: Boolean,
        default: false,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Task", taskSchema);