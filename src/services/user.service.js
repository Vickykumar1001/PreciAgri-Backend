const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const User = require('../models/user.model.js');
const Product = require('../models/product.model.js');
const Address = require('../models/address.model.js');
const jwtProvider = require("../config/jwtProvider.js")
const { sendVerificationEmail, sendResetPasswordEmail } = require("../utils");

const createUser = async (userData) => {
    try {
        console.log(userData);
        let { firstName, lastName, email, password, role, mobile, businessName, businessType } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // Check if the user exists but is unverified
            if (!existingUser.isVerified) {
                // If the user exists but is unverified, return a specific message
                throw new Error("User exists, but email verification is pending. Please verify your email.");
            }
            // If the user is already verified, throw the usual error
            throw new Error("User already exists with this email.");
        }

        // Hash the password
        password = await bcrypt.hash(password, 8);

        // Generate OTP and expiry time
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);  // OTP valid for 10 minutes
        const lastOtpSentAt = new Date();

        // Create the user with the provided data
        const user = await User.create({
            firstName, lastName, email, password, role, otp, otpExpires, lastOtpSentAt, mobile, businessName, businessType
        });

        // Send OTP verification email
        await sendVerificationEmail({
            name: user.firstName,
            email: user.email,
            otp: user.otp,
        });

        return user;
    } catch (error) {
        console.log("error - ", error.message);
        throw new Error(error.message);
    }
};
const resetPassword = async (userData) => {
    try {
        console.log(userData);
        let { email, newPassword } = userData;

        // Check if user already exists
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }
        // Hash the password
        user.password = await bcrypt.hash(newPassword, 8);
        await user.save();
        return { message: "Password updated successfully" };
    } catch (error) {
        console.log("error - ", error.message);
        throw new Error(error.message);
    }
};
const resendOTP = async (userData) => {
    try {
        console.log(userData);

        const { email } = userData;
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }

        const now = new Date();
        const THIRTY_SECONDS = 30 * 1000; // 30 seconds in milliseconds

        // Check if 30 seconds have passed since the last OTP was sent
        if (user.lastOtpSentAt && (now.getTime() - new Date(user.lastOtpSentAt).getTime()) < THIRTY_SECONDS) {
            throw new Error("You can request a new OTP only after 30 seconds.");
        }

        // Generate new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Set expiry for 10 minutes

        // Update user's OTP, expiry, and last sent time
        user.otp = otp;
        user.otpExpires = otpExpires;
        user.lastOtpSentAt = now;

        // Save updated user data
        await user.save();

        // Send the OTP to the user
        await sendVerificationEmail({
            name: user.firstName,
            email: user.email,
            otp: user.otp,
        });

        return { message: "OTP sent successfully", otpExpires: otpExpires.toISOString() };
    } catch (error) {
        console.error("Error - ", error.message);
        throw new Error(error.message);
    }
};

const resendOTPForgotPassword = async (userData) => {
    try {
        console.log(userData);
        const { email } = userData;
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }

        const now = new Date();
        const THIRTY_SECONDS = 30 * 1000; // 30 seconds in milliseconds

        // Check if 30 seconds have passed since the last OTP was sent
        if (user.lastOtpSentAt && (now.getTime() - new Date(user.lastOtpSentAt).getTime()) < THIRTY_SECONDS) {
            throw new Error("You can request a new OTP only after 30 seconds.");
        }

        // Generate new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Set expiry for 10 minutes

        // Update user's OTP, expiry, and last sent time
        user.otp = otp;
        user.otpExpires = otpExpires;
        user.lastOtpSentAt = now;

        // Save updated user data
        await user.save();

        // Send the OTP to the user
        await sendResetPasswordEmail({
            name: user.firstName,
            email: user.email,
            otp: user.otp,
        });

        return { message: "OTP sent successfully", otpExpires: otpExpires.toISOString() };
    } catch (error) {
        console.error("Error - ", error.message);
        throw new Error(error.message);
    }
};
const forgotPassword = async (userData) => {
    try {
        console.log(userData);

        const { email } = userData;
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }
        const now = new Date();
        // Generate new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Set expiry for 10 minutes

        // Update user's OTP, expiry, and last sent time
        user.otp = otp;
        user.otpExpires = otpExpires;
        user.lastOtpSentAt = now;

        // Save updated user data
        await user.save();

        // Send the OTP to the user
        await sendResetPasswordEmail({
            name: user.firstName,
            email: user.email,
            otp: user.otp,
        });

        return { message: "OTP sent successfully", otpExpires: otpExpires.toISOString() };
    } catch (error) {
        console.error("Error - ", error.message);
        throw new Error(error.message);
    }
};
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

        return ({ user, jwt, message: "Login Success" });
    } else {
        throw new Error("Invalid or expired OTP");
    }
};
const verifyForgotPasswordOTP = async (verifyData) => {
    const { otp, email } = verifyData;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    // Check if OTP matches and is still valid
    if (user.otp === otp && user.otpExpires > Date.now()) {
        // Clear OTP-related fields to ensure it's used only once
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Return success message, allowing the user to proceed to reset password
        return { message: "OTP Verified. Proceed to reset your password." };
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
const getUserAddress = async (req) => {
    const user = req.user._id;
    const addresses = await Address.find({ user });
    return addresses;
}
const getSellerDetail = async (req) => {
    const userId = req.params.sellerId;
    const user = await User.findById(userId);
    console.log("user from seller detail ", user)
    const addresses = await Address.find({ user: userId });
    console.log("addresses from seller detail ", addresses)
    const details = {
        businessName: user.businessName,
        businessType: user.businessType,
        streetAddress: addresses[0].streetAddress,
        city: addresses[0].city,
        state: addresses[0].state,
        zipCode: addresses[0].zipCode,
    }
    return details;
}
const addUserAddress = async (req) => {
    const user = req.user;
    const { firstName, lastName, streetAddress, city, state, zipCode, mobile } = req.body;
    const newAddress = new Address({ firstName, lastName, streetAddress, city, state, zipCode, mobile, user: user._id });
    const savedAddress = await newAddress.save();

    // Append the new address to the user's addresses field
    user.addresses = user.addresses || [];
    user.addresses.push(savedAddress._id);
    await user.save();
    return savedAddress;
}
const changePassword = async (userId, oldPassword, newPassword) => {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found.');
    }

    // Verify the old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
        throw new Error('Old password is incorrect.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();
};
const getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        console.log("error - ", error)
        throw new Error(error.message)
    }
}

const getMyProducts = async (userId) => {
    // Fetch the product IDs from the user schema
    const user = await User.findById(userId).select('product').lean();
    if (!user || !user.product || user.product.length === 0) {
        return []; // Return an empty array if no products are found
    }

    // Use the product IDs to fetch products
    const products = await Product.find({ _id: { $in: user.product } })
        .select('_id title brand description sizes imagesUrl') // Select only relevant fields
        .lean();

    // Format the response
    return products;
};
const updateUserProfile = async (userId, updateData) => {
    try {
        console.log(updateData)
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        return updatedUser;
    } catch (error) {
        throw new Error('Failed to update user profile: ' + error.message);
    }
};
module.exports = {
    createUser,
    verifyOTP,
    findUserById,
    getUserProfileByToken,
    getUserByEmail,
    getAllUsers,
    addUserAddress,
    getUserAddress,
    resendOTP,
    getSellerDetail,
    forgotPassword,
    verifyForgotPasswordOTP,
    resendOTPForgotPassword,
    resetPassword,
    changePassword,
    getMyProducts,
    updateUserProfile
}