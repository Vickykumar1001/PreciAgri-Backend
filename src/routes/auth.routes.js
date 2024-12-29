const express = require("express");
const router = express.Router();

const { register, verifyEmail, login, resendOTP, forgotPassword, resendOTPForgotPassword, resetPassword } = require("../controllers/auth.controller")


router.post("/signup", register)
router.post('/verify-email', verifyEmail);
router.post('/verify-otp-forgot-password', verifyEmail);
router.post('/resend-otp', resendOTP);
router.post('/resend-otp-forgot-password', resendOTPForgotPassword);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword)
router.post("/signin", login)

module.exports = router;