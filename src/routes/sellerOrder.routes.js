// routes/orderRoutes.js
const express = require('express');
const { getOrdersBySeller } = require('../controllers/sellerOrder.controller'); // Import the controller
const router = express.Router();

// Define the route for fetching orders by seller ID
router.get('/orders/seller/:sellerId', getOrdersBySeller);

module.exports = router;