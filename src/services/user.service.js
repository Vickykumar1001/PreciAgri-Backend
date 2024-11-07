const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const User = require('../models/user.model.js');
const jwtProvider = require("../config/jwtProvider.js")
const { sendVerificationEmail } = require("../utils");

const createUser = async (userData) => {
    try {

        let { firstName, lastName, email, password, role, mobile } = userData;

        const isUserExist = await User.findOne({ email });


        if (isUserExist) {

            throw new Error("User already exist with email : ", email)
        }

        password = await bcrypt.hash(password, 8);
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        const user = await User.create({ firstName, lastName, email, password, role, otp, otpExpires, mobile })
        await sendVerificationEmail({
            name: user.firstName,
            email: user.email,
            otp: user.otp,
        });

        return user;

    } catch (error) {
        console.log("error - ", error.message)
        throw new Error(error.message)
    }

}
const verifyOTP = async (verifyData) => {
    const { otp, email } = verifyData;
    console.log(email);
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }
    if (user.otp === otp && user.otpExpires > Date.now()) {
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        const jwt = jwtProvider.generateToken(user._id);
        return ({ jwt, message: "Login Success" });
    } else {
        throw new Error("Invalid or expired OTP");
    }
};
const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("user not found with id : ", userId)
        }
        return user;
    } catch (error) {
        console.log("error :------- ", error.message)
        throw new Error(error.message)
    }
}

const getUserByEmail = async (email) => {
    try {

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("user found with email : ", email)
        }

        return user;

    } catch (error) {
        console.log("error - ", error.message)
        throw new Error(error.message)
    }
}

const getUserProfileByToken = async (token) => {
    try {

        const userId = jwtProvider.getUserIdFromToken(token)

        console.log("userr id ", userId)


        const user = (await findUserById(userId)).populate("addresses");
        user.password = null;

        if (!user) {
            throw new Error("user not exist with id : ", userId)
        }
        return user;
    } catch (error) {
        console.log("error ----- ", error.message)
        throw new Error(error.message)
    }
}

const getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        console.log("error - ", error)
        throw new Error(error.message)
    }
}

module.exports = {
    createUser,
    verifyOTP,
    findUserById,
    getUserProfileByToken,
    getUserByEmail,
    getAllUsers
}