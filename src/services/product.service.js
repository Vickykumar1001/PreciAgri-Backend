const Category = require("../models/category.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

// Create a new product
async function createProduct(req) {
  const reqData = req.body;
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

  const product = new Product({
    sellerId: userId,
    title: reqData.title,
    description: reqData.description,
    brand: reqData.brand,
    sizes: reqData.sizes,
    imagesUrl: reqData.imagesUrl,
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
async function updateProduct(productId, reqData) {
  const updatedProduct = await Product.findByIdAndUpdate(productId, reqData);
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
