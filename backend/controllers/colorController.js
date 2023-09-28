const Color = require('../models/color');

const colorController = {

    async createColor(req, res, next) {
        try {
            const { label, value } = req.body;
            console.log(req.body)

            const labelAlreadyExists = await Color.exists({ label: label });
            if (labelAlreadyExists) {
                const error = {
                    status: 409,
                    message: `Color already exists`
                }
                return next(error);
            }
            const valueAlreadyExists = await Color.exists({ value: value });
            if (valueAlreadyExists) {
                const error = {
                    status: 409,
                    message: `Color already exists`
                }
                return next(error);
            }
            const newColor = new Color({ label: label, value: value });

            const color = await newColor.save();

            return res.status(200).json({ message: `${color.label} color has been saved` })
        } catch (error) {
            return next(error);
        }
    },

    async getColors(req, res, next) {
        try {
            const allColors = await Color.find({});

            if (!allColors) {
                const error = {
                    status: 404,
                    message: 'No colors found'
                }
                return next(error);
            }

            res.status(200).json({ colors: allColors })
        } catch (error) {
            return next(error);
        }
    },

    async getColor(req, res, next) {

        try {
            const { id } = req.params;

            const color = await Color.findOne({ _id: id });
            if (!color) {
                const error = {
                    status: 404,
                    message: 'No color found'
                }
                return next(error);
            }

            res.status(200).json({ color: color });
        } catch (error) {
            return next(error);
        }
    },

    async updateColor(req, res, next) {
        try {
            const { id, label, value } = req.body;

            await Color.findByIdAndUpdate({ _id: id }, { label, value }, { new: true });

            res.status(200).send({ message: 'color updated successfully' })
        } catch (error) {
            return next(error);
        }
    },

    async deleteColor(req, res, next) {
        try {
            const { id } = req.params;

            await Color.findByIdAndDelete({ _id: id });

            res.status(200).send({ message: 'color deleted successfully' })
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = colorController;