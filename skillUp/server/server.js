const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const goalRoutes = require("./routes/goal");
const taskRoutes = require("./routes/task");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDb();

app.get("/", (req,res)=>{
    res.send("Skillup running");
});

app.use("/api/users", userRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/tasks/", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
