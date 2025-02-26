const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("User token:", token);

  // Check if the token is provided
  if (!token) {
    return res.status(401).json({
      status: 0,
      message: "Authentication required. Please provide a token.",
    });
  }

  const secretKey = process.env.JWT_SECRET_KEY;

  // Remove "Bearer" prefix if it exists
  const tokenWithoutBearer = token.startsWith("Bearer ")
    ? token.slice(7)
    : token;

  try {
    // Verify and decode the token
    const decoded = jwt.verify(tokenWithoutBearer, secretKey);

    // Attach decoded user data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res
      .status(401)
      .json({ status: 0, message: "Invalid token", error: err.message });
  }
};

module.exports = verifyToken;
