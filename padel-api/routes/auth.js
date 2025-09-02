const express = require("express");
const router = express.Router();
const { register, login, getSession } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/session", getSession);

module.exports = router;
