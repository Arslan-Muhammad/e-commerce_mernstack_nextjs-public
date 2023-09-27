const Color = require('../models/color');

const colorController = {

    async createColor(req, res, next) {
        try {
            const { title } = req.body;

            const alreadyExists = await Color.findOne({ title: title });
            if (alreadyExists) {
                const error = {
                    status: 409,
                    message: `${alreadyExists.title} Color already exists`
                }
                return next(error);
            }
            const newColor = new Color({ title: title });

            const color = await newColor.save();

            return res.status(200).json({ message: `${color.title} new color has been saved` })
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
            const { id, title } = req.body;

            await Color.findByIdAndUpdate({ _id: id }, { title : title}, { new: true });

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