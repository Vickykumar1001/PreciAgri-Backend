const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller.js");
const authenticate = require("../middleware/authenticat.js");


router.get('/', authenticate, productController.getAllProducts);
router.get('/id/:id', authenticate, productController.findProductById);
router.get('/search', authenticate, productController.searchProduct);
router.get('/getproductbycategory/:category', authenticate, productController.findProductByCategory);

module.exports = router;