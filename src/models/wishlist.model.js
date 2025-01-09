const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            addedAt: { type: Date, default: Date.now },
        },
    ],
});

const Wishlist = mongoose.model('wishlist', WishlistSchema);

module.exports = Wishlist;

