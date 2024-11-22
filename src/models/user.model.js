const mongoose = require("mongoose");
const validator = require('validator');


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide first name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please provide last name"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: [8, "Password must be at least 8 characters long"],
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
    required: [true, "Please provide mobile number"],
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: "Please enter a valid 10-digit mobile number",
    },
  },
  businessName: {
    type: String,
    required: function () { return this.role === "Seller"; }
  },
  businessType: {
    type: String,
    required: function () { return this.role === "Seller"; },
    enum: ["Shopkeeper", "Wholesaler", "Distributor", "Service Provider"]
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
  // products created
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
