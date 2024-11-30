const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateJwtToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    const hash_password = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      hash_password,
    });

    const savedUser = await newUser.save();

    const token = generateJwtToken(savedUser._id);

    return res.status(201).json({
      token,
      user: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        fullName: `${savedUser.firstName} ${savedUser.lastName}`,
      },
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.authenticate(password))) {
      return res.status(400).json({
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    const token = generateJwtToken(user._id);

    const {
      _id,
      firstName,
      lastName,
      fullName,
    } = user;

    res.cookie("token", token, { expiresIn: "7d" });

    return res.status(200).json({
      token,
      user: {
        _id,
        firstName,
        lastName,
        email,
        fullName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    return res.status(200).json({ user: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful. Have a great day!",
  });
};
