import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    /* =========================
       GET TOKEN FROM HEADER
    ========================== */

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    /* =========================
       TOKEN NOT FOUND
    ========================== */

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    /* =========================
       VERIFY TOKEN
    ========================== */

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    /* =========================
       FIND USER
    ========================== */

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    /* =========================
       ATTACH USER TO REQUEST
    ========================== */

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =========================
   ALIAS EXPORT (FIX)
   Allows routes to use verifyToken
========================= */

export const verifyToken = protect;
