const jwt = require("jsonwebtoken");

/**
 * Verifies the Bearer JWT in the Authorization header.
 * On success attaches the decoded payload to req.userData and continues;
 * otherwise responds with 401 Unauthorized.
 */
module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    req.userData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
