const express=require("express");
const router=express.Router();
const productController=require("../controllers/product.controller.js");


router.get('/', productController.getAllProducts);
router.get('/id/:id', productController.findProductById);
router.get('/search', productController.searchProduct);
router.get('/getproductbycategory/:category', productController.findProductByCategory);

module.exports = router;