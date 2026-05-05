import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const adminLogin = async (req, res) => {
     try {
        const {identifier, password } = req.body;

        const admin = await User.findOne({
            $or: [{email: identifier}, {mobile: identifier}],
            role: "ADMIN",
        });

        if(!admin) {
            return res.status(401).json({ message: "Unauthorized"});
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { userId : admin._id, role:admin.role },
            process.env.JWT_SECRET,
            {expiresIn : "1d"}
        );

        res.json({
            status: "SUCCESS",
            token,
            role: admin.role,
            name: admin.name
        })
     } catch (error) {
        console.log("Admin login error:", error);
        res.status(500).json({ message: "Something went wrong" });
     }
};