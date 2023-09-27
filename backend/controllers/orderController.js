const Order = require('../models/order');
const User = require('../models/user');
const Cart = require('../models/cart');

const orderController = {

    // @desc getOrder place by user
    // @route /api/get-orders
    // @access auth - priavte
    async createOrder(req, res, next) {
        const { COD, couponApplied } = req.body;
        const { _id } = req.user;
        try {
            if (!COD) {
                const error = {
                    status: 404,
                    message: 'create order on Cash Failed'
                }
                return next(error);
            }
            const user = await User.findById(_id);
            let userCart = await Cart.findOne({ orderby: user._id });
            let finalAmout = 0;
            if (couponApplied && userCart.totalAfterDiscount) {
                finalAmout = userCart.totalAfterDiscount;
            } else {
                finalAmout = userCart.cartTotal;
            }

            let newOrder = await new Order({
                products: userCart.products,
                paymentIntent: {
                    id: uniqid(),
                    method: "COD",
                    amount: finalAmout,
                    status: "Cash on Delivery",
                    created: Date.now(),
                    currency: "usd",
                },
                orderby: user._id,
                orderStatus: "Cash on Delivery",
            }).save();
            let update = userCart.products.map((item) => {
                return {
                    updateOne: {
                        filter: { _id: item.product._id },
                        update: { $inc: { quantity: -item.count, sold: +item.count } },
                    },
                };
            });
            const updated = await Product.bulkWrite(update, {});
            res.status(200).json({ message: "success" });
        } catch (error) {
            return next(error);
        }
    },

    // @desc getOrder place by user
    // @route /api/get-orders
    // @access auth - priavte
    async getOrders() {
        const { _id } = req.user;
        try {

            const userorders = await Order.findOne({ orderby: _id })
                .populate("products.product")
                .populate("orderby")
                .exec();

            res.status(200).json(userorders);
        } catch (error) {
            return next(error);
        }
    },

    // @desc getOrder place by user
    // @route /api/get-orders
    // @access auth - admin - priavte
    async getAllOrders() {
        try {
            const allUserOrders = await Order.find()
                .populate("products.product")
                .populate("orderby")
                .exec();
            res.status(200).json(allUserOrders);
        } catch (error) {
            return next(error);
        }
    },

    // @desc getOrderbyUserId
    // @route /api/getorderbyuser/:id
    // @access auth - admin - priavte
    async getOrderByUserId() {
        const { id } = req.params;

        try {
            const userorders = await Order.findOne({ orderby: id })
                .populate("products.product")
                .populate("orderby")
                .exec();
            res.status(200).json(userorders);
        } catch (error) {
            return next(error);
        }
    },

    // @desc getOrderbyUserId
    // @route /api/getorderbyuser/:id
    // @access auth - admin - priavte
    async updateOrderStatus() {
        const { status } = req.body;
        const { id } = req.params;
        validateMongoDbId(id);
        try {
            const updateOrderStatus = await Order.findByIdAndUpdate(
                id,
                {
                    orderStatus: status,
                    paymentIntent: {
                        status: status,
                    },
                },
                { new: true }
            );
            res.status(200).json(updateOrderStatus);
        } catch (error) {
            return next(error);
        }
    }

}

module.exports = orderController;