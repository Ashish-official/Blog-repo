import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token provided" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.roles !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};
