const admin = require("../config/firebaseAdmin");

const verifyToken = async(req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        res.status(401).json({message: "No token provided"});
    }
    
    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {uid: decodedToken.uid};
        next();
    }
    catch(err){
        console.error("Token verification failed", err.message);
        res.status(403).json({message: "Invalid or expired token"});
    }
};

module.exports = verifyToken;