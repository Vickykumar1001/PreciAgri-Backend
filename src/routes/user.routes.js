const express = require("express");

const router = express.Router();
const userController = require("../controllers/user.controller.js");
const authenticate = require("../middleware/authenticat.js");

router.get("/", authenticate, userController.getAllUsers)
router.get("/profile", authenticate, userController.getUserProfile)
router.get("/address", authenticate, userController.getUserAddress)
router.post("/address", authenticate, userController.addUserAddress)
router.get("/sellerDetail/:sellerId", authenticate, userController.getSellerDetail)
router.post("/change-password", authenticate, userController.changePassword)
router.get("/my-products", authenticate, userController.getMyProducts)
router.put('/profile/edit', authenticate, userController.editProfile);

module.exports = router;