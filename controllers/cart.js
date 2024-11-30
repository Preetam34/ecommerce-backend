const Cart = require("../models/cart");

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
}

exports.addItemToCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user._id }).exec();

    if (cart) {
      let promiseArray = [];

      req.body.cartItems.forEach((cartItem) => {
        const product = cartItem.product;
        const item = cart.cartItems.find((c) => c.product == product);

        let condition, update;

        if (item) {
          condition = { user: req.user._id, "cartItems.product": product };
          update = {
            $set: {
              "cartItems.$": cartItem,
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: {
              cartItems: cartItem,
            },
          };
        }
        promiseArray.push(runUpdate(condition, update));
      });

      const responses = await Promise.all(promiseArray);
      res
      .status(201)
      .json({
        responses,
        message: "Item successfully added to your cart! 🛒",
      });
    } else {
      const newCart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems,
        convenienceFee: req.body.convenienceFee
      });

      const savedCart = await newCart.save();
      res
      .status(201)
      .json({
        cart: savedCart,
        message: "Item successfully added to your cart! 🛒",
      });
    }
  } catch (error) {
    res
    .status(400)
    .json({
      error,
      message: "Oops! Something went wrong. Please try again later.",
    });
  }
};

exports.getCartItems = (req, res) => {
  try {
    Cart.findOne({ user: req.user._id })
      .populate(
        "cartItems.product",
        "_id product name  price productPictures"
      )
      .exec((error, cart) => {
      
        if (error) return res.status(400).json({ error });

        if (cart) {
          const cartItems = {};
          cart.cartItems.forEach((item) => {
            const product = item.product;
            cartItems[product._id.toString()] = {
              _id: product._id.toString(),
              name: product.name,
              img: product.productPictures,
              price: product.price,
              qty: item.quantity,
            };
          });

          res.status(200).json({ cartItems,convenienceFee:cart.convenienceFee});
        }
      });
  } catch (error) {
    res
    .status(400)
    .json({
      error,
      message: "Oops! Something went wrong. Please try again later.",
    });
  }
};

exports.removeCartItems = async (req, res) => {
  try {
    const { productId } = req.body;
    if (productId) {
      const result = await Cart.updateOne(
        { user: req.user._id },
        {
          $pull: {
            cartItems: {
              product: productId,
            },
          },
        }
      ).exec();

      res
      .status(202)
      .json({
        result,
        message: "Item successfully removed from your cart! 🛒",
      });
    }
  } catch (error) {
    res
    .status(400)
    .json({
      error,
      message: "Oops! Something went wrong. Please try again later.",
    });
  }
};
