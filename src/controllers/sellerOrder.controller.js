// controllers/orderController.js
const Order = require('../models/order.model'); // Adjust path as needed to your models folder
// Controller to fetch orders by seller ID
const sellerOrderService = require("../services/sellerOrder.service")
const getOrdersBySeller = async (req, res) => {
    const sellerId = req.user._id.toString();
    console.log(sellerId);
    const order = await sellerOrderService.getOrdersBySeller(sellerId);
    //  console.log(order);
    return res.status(202).send(order);
};

module.exports = {
    getOrdersBySeller,
};