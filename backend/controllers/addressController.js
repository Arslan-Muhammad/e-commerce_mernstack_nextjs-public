const Address = require("../models/address");
const User = require("../models/user");

const addressController = {
    async createAddress(req, res, next) {
        const { name, address, city, phone } = req.body;
        const { _id } = req.user;
        try {
            const newAdd = await Address.create({
                name, address, city, phone, userId: _id
            })
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({ message: "Address created successfully" });
    },

    async getAddress(req, res, next) {
        const { _id } = req.user;

        try {
            const user = await User.findById(_id);
            if(!user) {
                const error = {
                    status: 404,
                    message: "User not found"
                }
                return next(error);
            }
            const address = await Address.findOne({ userId: _id });
            if (!address) {
                const error = {
                    status: 404,
                    message: 'Address not found'
                }
                return next(error);
            }

            res.status(200).json({ address: address });
        } catch (error) {
            return next(error);
        }
    },

    async updateAddress(req, res, next) {
        try {
            const { name, address, city, phone } = req.body;
            const { _id } = req.user;

            const user = await User.findById(_id);
            if (!user) {
                const error = {
                    status: 404,
                    message: 'User not found'
                }
                return next(error);
            }
            let updateData = {
                name, address, city, phone
            };

            const updatedAddress = await Address.updateOne({ userId: user._id }, updateData, { new: true })

            res.status(200).send({ message: 'Address Updated' });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = addressController;