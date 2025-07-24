const express = require("express");
const router = express.Router();
const {registerUser} = require("../controllers/usercontroller");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, registerUser);

module.exports = router;