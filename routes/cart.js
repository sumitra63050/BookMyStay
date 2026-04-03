const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const cartController = require("../controllers/cart");

router.get("/cart", isLoggedIn, wrapAsync(cartController.viewCart));

router.post("/listings/:id/cart", isLoggedIn, wrapAsync(cartController.addToCart));

router.delete("/listings/:id/cart", isLoggedIn, wrapAsync(cartController.removeFromCart));

module.exports = router;
