const bcrypt = require("bcrypt"); // For securely hashing passwords
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // For creating JWT tokens

// Use secret from environment, fallback to a hardcoded string (not safe for production)
const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

/**
 * Handles user signup
 * - Validates input
 * - Hashes password
 * - Saves new user to the database
 */
exports.signup = async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password)
        return res.status(400).json({ error: "userName and password required" });

    try {
        // Hash the password with a salt round of 10
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user document
        const user = await User.create({ userName, passwordHash });

        res.status(201).json({
            message: "User created successfully",
            userId: user._id,
        });
    } catch (err) {
        // Likely a duplicate username or validation error
        res.status(400).json({ error: err.message });
    }
};

/**
 * Handles user login
 * - Finds user by userName
 * - Verifies password
 * - Issues a signed JWT token upon successful authentication
 */
exports.login = async (req, res) => {
    const { userName, password } = req.body;

    // Find user by username
    const user = await User.findOne({ userName });

    // Check if user exists and password is correct
    if (!user || !(await user.verifyPassword(password))) {
        return res.status(401).json({ error: "Invalid userName or password" });
    }

    // Create JWT token with user ID, name, and role (expires in 1 hour)
    const token = jwt.sign(
        { _id: user._id, userName: user.userName, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
};
