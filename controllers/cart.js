const Listing = require("../models/listing");
const User = require("../models/user");

module.exports.viewCart = async (req, res) => {
    const user = await User.findById(req.user._id).populate("cart");
    res.render("listings/cart.ejs", { cartItems: user.cart });
};

module.exports.addToCart = async (req, res) => {
    let { id } = req.params;
    const user = await User.findById(req.user._id);
    
    // Check if listing already in cart to avoid duplicates
    if (!user.cart.includes(id)) {
        user.cart.push(id);
        await user.save();
        req.flash("success", "Listing added to your cart!");
    } else {
        req.flash("error", "Listing is already in your cart.");
    }
    
    res.redirect(`/listings/${id}`);
};

module.exports.removeFromCart = async (req, res) => {
    let { id } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { cart: id } });
    req.flash("success", "Listing removed from cart!");
    res.redirect("/cart");
};
