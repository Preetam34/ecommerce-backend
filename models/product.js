const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    name: { type: String },
    rating: { type: Number },
    comment: { type: String },
    image: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    categoryName: {
      type: String,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    specifications: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: String,
      trim: true,
    },
    numReviews: {
      type: String,
      trim: true,
    },
    reviews: [reviewSchema],
    productPictures: {
      type: String,
    },
    productDetailPic1: {
      type: String,
    },
    productDetailPic2: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedAt: Date,
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
