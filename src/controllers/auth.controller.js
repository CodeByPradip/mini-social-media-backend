const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// USER REGISTER API /api/auth/signup
const registerUser = async (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!username || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //   check user is already exist
  try {
    const userAlreadyExits = await userModel.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (userAlreadyExits) {
      return res.status(409).json({ message: "User already exits" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username: username,
      email: email,
      phone: phone,
      password: hashPassword,
    });

    res.cookie("token", generateToken(user._id), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        username,
        email,
        phone,
      },
    });
  } catch (error) {
    console.log("register failed");
    return res.status(500).json({ message: "User Register failed" });
  }
};

// USER LOGIN API /api/auth/login
const loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  try {
    const user = await userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatchedPass = await bcrypt.compare(password, user.password);

    if (!isMatchedPass) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.cookie("token", generateToken(user._id), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User login successfully",
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log("User login failed");
    return res.status(500).json({ message: "User login failed" });
  }
};

// GET CURRENT USER DATA  API /api/auth/get-me

const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Get current user",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT CURRENT USER   API /api/auth/logout

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

// CHANGE PASSWORD API /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const userId = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatchedPass = await bcrypt.compare(oldPassword, user.password);
    if (!isMatchedPass) {
      return res.status(404).json({ message: "Old Password is incorrect" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();

    return res.status(200).json({ message: "Password Change successfully" });
  } catch (error) {
    console.log(errror);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  changePassword,
};
