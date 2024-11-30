const express = require("express");

const {
  addItemToCart,
  getCartItems,
  removeCartItems,
} = require("../controllers/cart");

const { requireSignin } = require("../common-middleware");

const router = express.Router();

router.post(
  "/user/cart/addtocart",
  requireSignin,
  addItemToCart
);

router.post("/user/cart/getCartItems", requireSignin, getCartItems);
router.post("/user/cart/removeItem", requireSignin, removeCartItems);

module.exports = router;
