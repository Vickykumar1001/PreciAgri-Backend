const mongoose = require("mongoose");
const validator = require('validator');


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide name'],
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  role: {
    type: String,
    required: true,
    enum: ["Farmer", "Seller"],
    default: "Farmer"
  },
  mobile: {
    type: String,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addresses",
    },
  ],
  paymentInformation: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment_information",
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviews",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
