const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

/**
 * Middleware to authenticate requests using JWT.
 * 
 * - Verifies the token from the `Authorization` header
 * - Attaches the decoded user to `req.user` if valid
 * - Blocks access if token is missing, invalid, or expired
 */
module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization']; // Expected format: "Bearer <token>"
  const token = authHeader?.split(' ')[1]; // Extract token part

  // If no token is provided, reject the request
  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user in the database based on the ID encoded in the token
    const user = await User.findById(decoded._id);
    if (!user) return res.status(401).json({ error: 'Invalid user' });

    // Attach user info to request object so downstream routes can use it
    req.user = user;

    // Continue to the next middleware/controller
    next();
  } catch (err) {
    // Token verification failed
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
