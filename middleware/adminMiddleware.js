/**
 * Admin middleware to restrict access to admin-only routes.
 * Assumes req.user has been populated by previous authentication middleware.
 */

module.exports = (req, res, next) => {
    // Check if user is authenticated and has the 'admin' role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' });
    }
    next();
  };
  