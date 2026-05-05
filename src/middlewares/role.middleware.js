export const allowRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error("Role middleware error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
};
