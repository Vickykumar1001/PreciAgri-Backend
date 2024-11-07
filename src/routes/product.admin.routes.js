const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller.js");
const authenticat = require("../middleware/authenticat.js")

router.post('/', authenticat, productController.createProduct);
router.post('/creates', authenticat, productController.createMultipleProduct);
router.delete('/:id', authenticat, productController.deleteProduct);
router.put('/:id', authenticat, productController.updateProduct);

module.exports = router;