const express = require("express");
const router = express.Router();

const { register, verifyEmail, login } = require("../controllers/auth.controller")


router.post("/signup", register)
router.post('/verify-email', verifyEmail);
router.post("/signin", login)

module.exports = router;