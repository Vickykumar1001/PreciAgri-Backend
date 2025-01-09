const Wishlist = require('../models/wishlist.model');
const Product = require('../models/product.model');
const addToWishlist = async (userId, productId) => {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
        wishlist = new Wishlist({ userId, items: [] });
    }
    const exists = wishlist.items.some(item => item.productId.toString() === productId);
    if (!exists) {
        wishlist.items.push({ productId });
        await wishlist.save();
    }
    return wishlist;
};

const getWishlist = async (userId) => {
    const wishlist = await Wishlist.findOne({ userId })
        .populate({
            path: 'items.productId',
            select: '_id', // Only include the product ID
        });

    // Extract and return only the product IDs
    const productIds = wishlist ? wishlist.items.map(item => item.productId._id) : [];
    return productIds;
};


const getDetailedWishlistProducts = async (userId) => {
    // Fetch the wishlist for the user
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
        return []; // Return an empty array if no items in wishlist
    }

    // Extract product IDs from the wishlist
    const productIds = wishlist.items.map((item) => item.productId);

    // Fetch product details from the Product model
    const products = await Product.find({ _id: { $in: productIds } });

    return products;
};

const removeFromWishlist = async (userId, productId) => {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) throw new Error('Wishlist not found');
    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
    await wishlist.save();
    return wishlist;
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    getDetailedWishlistProducts,
};
