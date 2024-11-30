const Product = require("../models/product");
const slugify = require("slugify");
const shortid = require("shortid");
const category = require("../models/category");

exports.createProduct = async (req, res) => {
  try {
    if (req.files && req.files.length > 0) {
      console.log("Files found:", req.files);
    } else {
      console.log("No files found.");
    }

    const {
      name,
      category,
      price,
      stock,
      description,
      specifications,
      categoryName,
      numReviews,
      rating,
      reviews,
      productDetailPic1,
      productDetailPic2
    } = req.body;

    if (
      !name ||
      !category ||
      !price ||
      !stock ||
      !description ||
      !specifications
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let productPictures = "";
    let parsedReviews = [];
    if (reviews) {
      try {
        parsedReviews = reviews.map((review) => ({
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          image: review.image,
          user: review.user,
        }));
      } catch (parseError) {
        return res.status(400).json({ message: "Invalid reviews format." });
      }
    }

    const product = new Product({
      name,
      category,
      categoryName: categoryName || "",
      slug: slugify(name) + "-" + shortid.generate(),
      price,
      stock,
      description,
      specifications,
      productPictures,
      productDetailPic1,
      productDetailPic2,
      numReviews: numReviews || 0,
      rating: rating || 0,
      reviews: parsedReviews,
      createdBy: req.user._id,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      product: savedProduct,
      message: "Product successfully created.",
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to create product.", details: error.message });
  }
};

exports.getProductDetailsById = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ error: "Product Id Params required" });
    }

    const product = await Product.findOne({ _id: productId }).exec();

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found for provided Product Id" });
    }

    const similarProducts = await Product.find({
      category: product.category,
    }).exec();
    const categoryName = await category.findById({ _id: product.category });

    res
      .status(200)
      .json({ product, similarProducts, categoryName: categoryName.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required." });
    }

    let products;

    if (categoryName === "Best Sellers") {
      // Fetch 4 products from each category
      const categories = await Product.distinct("categoryName"); // Fetch unique category names
      const categoryProductsPromises = categories.map((category) =>
        Product.find({ categoryName: category })
          .sort({ rating: -1 }) // Assuming higher-rated products are best sellers
          .limit(4)
      );
      const productsByCategory = await Promise.all(categoryProductsPromises);

      products = productsByCategory.flat(); // Flatten the array of arrays
    } else {
      // Fetch products for the specific category
      products = await Product.find({ categoryName });

      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: `No products found for category: ${categoryName}` });
      }
    }

    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    const total = await Product.countDocuments();

    res.status(200).json({
      products,
      total,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch products.", details: error.message });
  }
};
