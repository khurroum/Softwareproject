const Product = require("../models/Product");

// =========================
// GET ALL PRODUCTS
// =========================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
};


// =========================
// GET SINGLE PRODUCT
// =========================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get product",
      error: error.message,
    });
  }
};


// =========================
// CREATE PRODUCT
// =========================
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      oldPrice,
      image,
      stock,
      rating,
      numReviews,
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      price === undefined ||
      !image
    ) {
      return res.status(400).json({
        message:
          "Please provide name, description, category, price, and image",
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      oldPrice,
      image,
      stock,
      rating,
      numReviews,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};


// =========================
// UPDATE PRODUCT
// =========================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};


// =========================
// DELETE PRODUCT
// =========================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};