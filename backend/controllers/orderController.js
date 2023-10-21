const Order = require('../models/order');
const User = require('../models/user');
const Address = require('../models/address');
const Product = require('../models/product');

const orderController = {

    // @desc getOrder place by user
    // @route /api/get-orders
    // @access auth - priavte
    async createOrder(req, res, next) {
        const { cart } = req.body;
        const { _id } = req.user;
        try {
            const user = await User.findById(_id);
            if (!user) {
                const error = {
                    status: 404,
                    message: 'User not found'
                }
                return next(error);
            }
            const address = await Address.findOne({ userId: user._id });
            if (!address) {
                const error = {
                    status: 401,
                    message: 'User have no address'
                }
                return next(error);
            }

            const product = cart.map(item => item);

            let newOrder = await new Order({
                products: cart,
                paymentIntent: {
                    created: Date.now(),
                    'status': 'pending'
                },
                orderby: user._id,
                orderStatus: "Payment Pending",
            }).save();

            let update = cart.map((item) => {
                return {
                    updateOne: {
                        filter: { _id: item._id },
                        update: { $inc: { quantity: -item.qty, sold: +item.qty } },
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
    // @access auth - admin - priavteW
    async getAllOrders(req, res, next) {
        try {
            const allUserOrders = await Order.find().populate("products._id").populate("orderby").exec();

            res.status(200).json(allUserOrders);
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
                .populate("products")
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