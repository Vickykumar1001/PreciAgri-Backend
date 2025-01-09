const wishlistService = require('../services/wishlist.service');

const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;
        const wishlist = await wishlistService.addToWishlist(userId, productId);
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const wishlist = await wishlistService.getWishlist(userId);
        res.status(200).json(wishlist);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
const getWishlistProducts = async (req, res) => {
    try {
        const userId = req.user._id; // Assume user ID comes from authentication middleware
        const products = await wishlistService.getDetailedWishlistProducts(userId);

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error in getWishlistProducts controller:', error);
        res.status(500).json({ message: 'Failed to fetch wishlist products' });
    }
};
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;
        const wishlist = await wishlistService.removeFromWishlist(userId, productId);
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    getWishlistProducts,
};
