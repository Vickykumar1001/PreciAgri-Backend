// productController.js
const productService = require("../services/product.service.js")
// Create a new product
async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req);
    console.log(product)
    return res.status(201).json(product);
  } catch (err) {
    // console.log(err)
    return res.status(500).json({ error: err.message });
  }
}

// Delete a product by ID
async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;
    const message = await productService.deleteProduct(productId);
    return res.json({ message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update a product by ID
async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    // console.log(req.body);
    const product = await productService.updateProduct(productId, req);
    return res.json(product);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
}

// Get all products
// async function getAllProducts(req, res) {
//   try {
//     const products = await productService.getAllProducts();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// Find a product by ID
async function findProductById(req, res) {
  try {
    const productId = req.params.id;
    console.log(productId)
    const product = await productService.findProductById(productId);
    return res.status(200).send(product);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

// Find products by category
async function findProductByCategory(req, res) {
  try {
    const category = req.params.category;
    const products = await productService.findProductByCategory(category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Search products by query
async function searchProduct(req, res) {
  try {
    const query = req.params.query;
    const products = await productService.searchProduct(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all products with filtering and pagination
async function getAllProducts(req, res) {
  try {

    const products = await productService.getAllProducts(req.query);

    return res.status(200).send(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

const createMultipleProduct = async (req, res) => {
  try {
    await productService.createMultipleProduct(req.body)
    res
      .status(202)
      .json({ message: "Products Created Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};


// const uploadProductImages = async (req, res) => {
//   try {
//     console.log("Uploading product images");
//     // Ensure req.files is an array

//     return res.status(StatusCodes.OK).json({ images: imageUrls });
//   } catch (error) {
//     console.error(error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Image upload failed' });
//   }
// };



module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  findProductByCategory,
  searchProduct,
  createMultipleProduct

};
