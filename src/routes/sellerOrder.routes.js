// routes/orderRoutes.js
const express = require('express');
const authenticate = require("../middleware/authenticat.js");
const { getOrdersBySeller } = require('../controllers/sellerOrder.controller'); // Import the controller
const router = express.Router();

// Define the route for fetching orders by seller ID
router.get('/orders', authenticate, getOrdersBySeller);

module.exports = router;