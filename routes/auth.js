const express = require("express");
const {
  signup,
  signin,
  signout,
  getUserData,
} = require("../controllers/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validators/auth");
const {
  requireSignin,
} = require("../common-middleware");
const router = express.Router();

router.post("/user/signup", validateSignupRequest, isRequestValidated, signup);

router.post("/user/login", validateSigninRequest, isRequestValidated, signin);

router.post("/user/logout", signout);

router.get("/user/get", requireSignin, getUserData);


module.exports = router;
