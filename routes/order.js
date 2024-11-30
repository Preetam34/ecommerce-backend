const {
  requireSignin,
} = require("../common-middleware");

const {
  addOrder,
  getOrders,
  getOrderById,
  getAllOrders,
} = require("../controllers/order");

const router = require("express").Router();

router.post("/order/addOrder", requireSignin, addOrder);
router.get("/order/getOrders", requireSignin, getOrders);
router.get("/order/getAllOrders", requireSignin, getAllOrders);
router.post("/order/getOrderById", requireSignin, getOrderById);

module.exports = router;
