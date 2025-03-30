const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Mongoose schema for storing user accounts.
 */
const userSchema = new mongoose.Schema({
    userName: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },

    // Role for access control; default is 'user'
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
});

/**
 * Instance method to compare a plain text password with the stored hash.
 * Used during login to validate user credentials.
 */
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

// Export the User model to interact with the 'users' collection in MongoDB
module.exports = mongoose.model('User', userSchema);
