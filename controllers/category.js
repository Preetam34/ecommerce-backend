const Category = require("../models/category");
const slugify = require("slugify");
const Product = require("../models/product");

exports.addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const category = new Category({
      name,
      slug: slugify(name),
      createdBy: req.user._id,
    });

    const savedCategory = await category.save();

    res.status(201).json({
      category: savedCategory,
      message: "Category successfully created.",
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ _id: -1 });

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    const categoryIds = categories.map((cat) => cat._id);
    const products = await Product.find({ category: { $in: categoryIds } });

    const categoryWithProductCount = categories.map((cat) => {
      const productCount = products.filter(
        (product) => product.category.toString() === cat._id.toString()
      ).length;

      return {
        _id: cat._id,
        name: cat.name,
        productCount,
      };
    });

    res.status(200).json({
      categories: categoryWithProductCount,
      totalProductCount: products.length,
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
};
