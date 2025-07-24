const User = require("../models/User");

const registerUser = async (req, res) => {
    const { name, email } = req.body;
    const uid = req.user.uid;


    if (!uid || !name || !email) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    try {
        let user = await User.findOne({ uid });

        if (!user) {
            user = await User.create({ uid, name, email });
        }
        res.status(200).json();
    }
    catch (err) {
        console.error("Registration error : " + err.message);
        res.status(500).json({ message: "server error" });
    }
}

module.exports = { registerUser };