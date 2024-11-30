const express = require("express");

const {
  requireSignin,
  upload,
} = require("../common-middleware");

const {createProduct, getProductsByCategory,getProductDetailsById,getAllProducts } = require("../controllers/product");

const router = express.Router();

router.post(
  "/product/create",
  requireSignin,
  upload.array("productPicture", 5), 
  createProduct
);

router.post("/product/getProducts/category", getProductsByCategory);

router.get("/product/:productId", getProductDetailsById);
router.get("/products/getAll", getAllProducts);

module.exports = router;