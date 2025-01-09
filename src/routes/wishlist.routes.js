const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const authenticate = require("../middleware/authenticat.js");
// Add to wishlist
router.post('/', authenticate, wishlistController.addToWishlist);

// Get user's wishlist
router.get('/', authenticate, wishlistController.getWishlist);
router.get('/products', authenticate, wishlistController.getWishlistProducts);

// Remove from wishlist
router.delete('/', authenticate, wishlistController.removeFromWishlist);

module.exports = router;
