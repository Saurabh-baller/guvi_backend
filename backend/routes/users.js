const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");


const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, reEnterPassword } = req.body;

  if (password !== reEnterPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully.", newUser });
  } catch (error) {
    console.error("Registration error:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create and sign a JSON Web Token (JWT)
    const tokenPayload = { userId: user._id, email: user.email };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send the token to the client
    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error("Login error:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data." });
  }
});

// Route to update the current user's data
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const updatedUserData = {
      age: req.body.age,
      gender: req.body.gender,
      dob: req.body.dob,
      mobile: req.body.mobile,
    };

    const user = await User.findByIdAndUpdate(req.user.userId, updatedUserData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user data." });
  }
});

module.exports = router;