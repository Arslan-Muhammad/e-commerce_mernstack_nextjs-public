const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");

const cartController = {

    async userCart(req, res, next) {

        try {
            const { cart } = req.body;
            const { _id } = req.user;

            let Products = [];

            const user = await User.findById(_id);
            if (!user) {
                const error = {
                    status: 404,
                    message: "User not found"
                }
                return next(error);
            }

            // // check if User is already have product in cart
            const alreadyExistCart = await Cart.findOne({
                orderby: user._id
            })

            if (alreadyExistCart) {
                await Cart.findOneAndUpdate(alreadyExistCart._id);
            }

            for (let i = 0; i < cart.length; i++) {
                let productObj = {};

                productObj.product = cart[i]._id;
                productObj.qty = cart[i].qty;
                productObj.color = cart[i].color;
                productObj.count = cart[i].qty;
                productObj.price = cart[i].price;
                let getPrice = await Product.findById(cart[i]._id).select('price').exec();
                productObj.price = getPrice.price;
                Products.push(productObj);
            }

            // total price of cart items
            let cartTotal = 0;

            for (let i = 0; i < Products.length; i++) {
                cartTotal = cartTotal + Products[i].price * Products[i].qty;
            }

            // save to database
            let newCart = new Cart({
                products: Products,
                cartTotal: cartTotal,
                orderby: user?._id
            })

            await newCart.save();

            res.status(200).json({ message: 'Cart saved successfully' });

        } catch (error) {
            return next(error);
        }
    }
}

module.exports = cartController;