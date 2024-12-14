const userService = require("../services/user.service.js")
const jwtProvider = require("../config/jwtProvider.js")
const bcrypt = require("bcrypt")
const cartService = require("../services/cart.service.js")

const register = async (req, res) => {

    try {
        const user = await userService.createUser(req.body);
        await cartService.createCart(user);

        return res.status(200).json({ message: "Success! Please check your email to verify account" })
    } catch (error) {
        console.log(error)
        if (error == "Error: User exists, but email verification is pending. Please verify your email.") {
            return res.status(400).json({ message: "User exists, but email verification is pending." })
        }
        return res.status(500).json({ error })
    }
}
const verifyEmail = async (req, res) => {
    try {
        const result = await userService.verifyOTP(req.body);
        return res.status(200).json(result);
    } catch (error) {
        if (error.message === "User not found" || error.message === "Invalid or expired OTP") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};
const resendOTP = async (req, res) => {
    try {
        const result = await userService.resendOTP(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
const login = async (req, res) => {
    const { password, email } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }
    try {
        const user = await userService.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found With Email ', email });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Email not verified' });
        }
        const jwt = jwtProvider.generateToken(user._id);

        return res.status(200).send({ user, jwt, message: "Login Success" });

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
module.exports = { register, verifyEmail, login, resendOTP }