const Category = require("../models/category.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const { StatusCodes } = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
// Create a new product
async function createProduct(req) {
  const reqData = req.body;
  console.log(reqData);
  const userId = req.user._id;
  // let topLevel = await Category.findOne({ name: reqData.topLevelCategory });

  // if (!topLevel) {
  //   const topLevelCategory = new Category({
  //     name: reqData.topLevelCategory,
  //     level: 1,
  //   });

  //   topLevel = await topLevelCategory.save();
  // }

  // let secondLevel = await Category.findOne({
  //   name: reqData.secondLevelCategory,
  //   parentCategory: topLevel._id,
  // });

  // if (!secondLevel) {
  //   const secondLevelCategory = new Category({
  //     name: reqData.secondLevelCategory,
  //     parentCategory: topLevel._id,
  //     level: 2,
  //   });

  //   secondLevel = await secondLevelCategory.save();
  // }

  // let thirdLevel = await Category.findOne({
  //   name: reqData.thirdLevelCategory,
  //   parentCategory: secondLevel._id,
  // });

  // if (!thirdLevel) {
  //   const thirdLevelCategory = new Category({
  //     name: reqData.thirdLevelCategory,
  //     parentCategory: secondLevel._id,
  //     level: 3,
  //   });

  //   thirdLevel = await thirdLevelCategory.save();
  // }
  const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

  const imageUrls = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      use_filename: true,
      folder: 'product-images',
    });
    imageUrls.push(result.secure_url);
    fs.unlinkSync(file.tempFilePath); // Remove temporary file after uploading
  }
  const product = new Product({
    sellerId: userId,
    title: reqData.title,
    description: reqData.description,
    brand: reqData.brand,
    sizes: JSON.parse(reqData.sizes),
    imagesUrl: imageUrls,
    // category: thirdLevel
    topLevelCategory: reqData.topLevelCategory,
    secondLevelCategory: reqData.secondLevelCategory,
    thirdLevelCategory: reqData.thirdLevelCategory,
  });

  const savedProduct = await product.save();

  console.log("Product created by user " + userId);
  const user = await User.findById(userId);

  if (user) {
    user.product.push(savedProduct._id);
    await user.save();
  }


  return savedProduct;
}
// Delete a product by ID
async function deleteProduct(productId) {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("product not found with id - : ", productId);
  }

  await Product.findByIdAndDelete(productId);

  return "Product deleted Successfully";
}

// Update a product by ID
async function updateProduct(productId, req) {
  const userId = req.user._id;
  const reqData = req.body;

  // Find the product to be updated
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.sellerId.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'Unauthorized to edit this product' });
  }

  // Update other product details
  product.title = reqData.title || product.title;
  product.description = reqData.description || product.description;
  product.brand = reqData.brand || product.brand;
  product.sizes = reqData.sizes ? JSON.parse(reqData.sizes) : product.sizes;
  product.topLevelCategory = reqData.topLevelCategory || product.topLevelCategory;
  product.secondLevelCategory = reqData.secondLevelCategory || product.secondLevelCategory;
  product.thirdLevelCategory = reqData.thirdLevelCategory || product.thirdLevelCategory;

  // Handle image updates
  const existingImages = reqData.existingImages ? JSON.parse(reqData.existingImages) : [];
  const imagesToRemove = product.imagesUrl.filter((url) => !existingImages.includes(url));

  // Remove unwanted images from Cloudinary
  for (const url of imagesToRemove) {
    const publicId = url.split('/').slice(-1)[0].split('.')[0]; // Extract public ID
    await cloudinary.uploader.destroy(`product-images/${publicId}`);
  }

  // Update product images
  const files = Array.isArray(req.files?.newImages) ? req.files.newImages : req.files?.newImages ? [req.files.newImages] : [];
  const newImageUrls = [];
  console.log("files size is", files.length)
  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      use_filename: true,
      folder: 'product-images',
    });
    newImageUrls.push(result.secure_url);
    fs.unlinkSync(file.tempFilePath); // Remove temporary file
  }
  console.log("image upload", newImageUrls);
  product.imagesUrl = [...existingImages, ...newImageUrls];

  // Save the updated product
  const updatedProduct = await product.save();
  return updatedProduct;
}

// Find a product by ID
async function findProductById(id) {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}

// Get all products with filtering and pagination
async function getAllProducts(reqQuery) {
  let {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqQuery;
  (pageSize = pageSize || 10), (pageNumber = pageNumber || 1);
  let query = Product.find()


  // if (category) {
  //   const existCategory = await Category.findOne({ name: category });
  //   if (existCategory)
  //     query = query.where("category").equals(existCategory._id);
  //   else return { content: [], currentPage: 1, totalPages: 1 };
  // }

  // if (color) {
  //   const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));
  //   const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
  //   query = query.where("color").regex(colorRegex);
  //   // query = query.where("color").in([...colorSet]);
  // }

  if (sizes) {
    const sizesSet = new Set(sizes);

    query = query.where("sizes.name").in([...sizesSet]);
  }

  if (minPrice && maxPrice) {
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  if (minDiscount) {
    query = query.where("discountPersent").gt(minDiscount);
  }

  if (stock) {
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }
  }

  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  // Apply pagination
  const totalProducts = await Product.countDocuments(query);

  const skip = (pageNumber - 1) * pageSize;

  query = query.skip(skip).limit(pageSize);

  const products = await query.exec();

  const totalPages = Math.ceil(totalProducts / pageSize);


  return { content: products, currentPage: pageNumber, totalPages: totalPages };
}

async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
};
