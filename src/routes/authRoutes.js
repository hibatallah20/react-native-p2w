import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: "15d" });
}

router.post("/register", async (req, res) => {
    try {
     const { firstname, lastname, username, email, phone, password } = req.body;
    
     if(!firstname || !lastname || !username || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
     }

     if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
     }
     
     if(password.length < 12){
        return res.status(400).json({ message: "Password should be at least 12 characters long" });
     }

     if(username.length < 3) {
        return res.status(400).json({ message: "Username should be at least 3 characters long "});
     }

     // check if user already exists
     const existingEmail = await User.findOne({ email });
     if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
     }

     const existingUsername = await User.findOne({ username });
     if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
     }

     const user = new User({
            firstname,
            lastname,
            username,
            email,
            phone,
            password,
            profileImage: "",
            bio: "",
            interests: [],
            instagram: ""
     })

     await user.save();

     const token = generateToken(user._id);


     res.status(201).json({
        token,
        user: {
            id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone,
            email: user.email,
            profileImage: user.profileImage
        },
     })
    }catch (error) {
        console.log("Error in register route", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password ) return res.status(400).json({ message: "All fields are required" });
        
        // check if user exists 
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: "Invalid credentials" });

        // check if password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials"});

        // generate token

        const token = generateToken(user._id);


        res.status(201).json({
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage
        },
     })
    } catch (error) {
        console.log("Error in login route", error);
        res.status(500).json({ message: "Internal server error" });

    }
});

export default router;