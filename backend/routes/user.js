const express = require('express');
const { signupschema, signinschema } = require('../zod');
const userrouter = express.Router();
const { User } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


userrouter.post("/signup", async(req, res) => {
    const { email, username, password } = req.body;
    const validate = signupschema.safeParse({ email, username, password });
    if (!validate.success) {
        return res.status(400).json({ error: validate.error});
    }

    try{
        const hashedpassword = await bcrypt.hash(password, 10);
        await User.create({ email, username, password:hashedpassword });
    }catch(err){
        console.log("Error in signup:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
    // Handle user signup
    res.json({ message: "User signed up" });
})

userrouter.post("/signin", async(req, res) => {
    const { email, password } = req.body;
    const validate = signinschema.safeParse({ email, password });
    if (!validate.success) {
        return res.status(400).json({ error: validate.error.errors });
    }
    
    try{
        const user = await User.findOne({ email })
        if(!user){
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ error: "Invalid email or password" });
        }
        // Generate JWT token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);
        res.json({ token });
    }catch(err){
        console.log("Error in signin:", err);
        return res.status(500).json({ error: "Internal server error" });
    }

    // Fetch user-specific todos
    res.json({ massage: "User's todos" });
})

module.exports = userrouter;