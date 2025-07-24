const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    uid:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Goal", goalSchema);