const express = require("express");
const router = express.Router();

const { register, verifyEmail, login, resendOTP } = require("../controllers/auth.controller")


router.post("/signup", register)
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);
router.post("/signin", login)

module.exports = router;