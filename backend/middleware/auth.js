// const jwt = require("jsonwebtoken");

// const auth = (req, res, next) => {
//   const token = req.header("x-auth-token");

//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(400).json({ msg: "Token is not valid" });
//   }
// };

// module.exports = auth;
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const tokenWithBearer = req.header("Authorization");

  // Check if the token exists
  if (!tokenWithBearer) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  // Remove the "Bearer" prefix from the token
  const token = tokenWithBearer.replace("Bearer ", "");

  // Verify the token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// const authMiddleware = (req, res, next) => {
//   // Get the token from the request headers
//   const token = req.header("Authorization");

//   // Check if the token exists
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized. No token provided." });
//   }

//   // Verify the token
//   try {
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid token." });
//   }
// };

module.exports = authMiddleware;