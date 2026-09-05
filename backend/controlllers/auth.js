const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  const { username, passwordHash } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    const user = await User.create({
      username,
      passwordHash: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      },
    );

    if (user) {
      return res.status(201).json({
        _id: user.id,
        username: user.username,
        message: "User registered successfully",
        token: token,
      });
    } else {
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const login = async (req, res) => {
  const { username, passwordHash } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const matchPass = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!matchPass) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      },
    );

    res.status(200).json({
      token,
      user: {
        _id: user.id,
        username: user.username,
        message: "Logged In successfully",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
