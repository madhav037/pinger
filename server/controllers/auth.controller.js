import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword });
    try {
        await user.save();
        res.status(201).json({"data": user, "message": "User created successfully"});
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id, name : existingUser.name }, process.env.JWT_SECRET);
        const { password : pass, ...userInfo } = existingUser._doc;
        
        res.cookie("pinger_access_token", token).status(200).json({ result: userInfo, token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const signOut = async (req, res, next) => {
    try {
      res.clearCookie("pinger_access_token");
      res.status(200).json("user Logged out");
    } catch (error) {
      next(error);
    }
};