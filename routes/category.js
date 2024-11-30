const express = require("express");
const router = express.Router();
const {
  addCategory,
  getCategories,
} = require("../controllers/category");
const {
  requireSignin,
} = require("../common-middleware");

router.post(
  "/category/create",
  requireSignin,
  addCategory
);
router.get("/category/getcategories", getCategories);

module.exports = router;
