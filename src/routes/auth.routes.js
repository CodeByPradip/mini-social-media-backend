const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  changePassword,
} = require("../controllers/auth.controller");
const { authUserMiddleware } = require("../middlewares/auth.middleware");

// USER REGISTER            API /api/auth/signup
// USER LOGIN               API /api/auth/login
// GET CURRENT USER DATA    API /api/auth/get-me
// LOGOUT CURRENT USER      API /api/auth/logout
// CHANGE PASSWORD          API /api/auth/change-password


router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/get-me", authUserMiddleware, getCurrentUser);
router.post("/logout", authUserMiddleware, logoutUser);
router.post("/change-password", authUserMiddleware, changePassword);

module.exports = router;
