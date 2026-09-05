const express = require("express");
const { login } = require("../controlllers/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
