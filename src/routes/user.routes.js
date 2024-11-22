const express = require("express");

const router = express.Router();
const userController = require("../controllers/user.controller.js");
const authenticate = require("../middleware/authenticat.js");

router.get("/", authenticate, userController.getAllUsers)
router.get("/profile", authenticate, userController.getUserProfile)
router.post("/address", authenticate, userController.addUserAddress)

module.exports = router;