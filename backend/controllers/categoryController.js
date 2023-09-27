const Category = require('../models/category');


const categoryContoller = {

    // @desc create a category
    // @route /api/category/create
    // @access private
    async createCategory(req, res, next) {
        try {
            const { title } = req.body;

            const upper = title.charAt(0).toUpperCase() + title.substring(1);

            const alreadyExists = await Category.findOne({ title: upper });
            if (alreadyExists) {
                const error = {
                    status: 409,
                    message: 'Category already exists'
                }
                return next(error);
            }

            await Category.create({ title: upper });

            res.status(200).json({ message: 'category successfully created' });
        } catch (error) {
            return next(error);
        }
    },

    // @desc get all category
    // @route /api/category/all
    // @access public
    async getAllCategory(req, res, next) {
        try {
            const category = await Category.find({});
            if (!category) {
                const error = {
                    status: 404,
                    message: 'Category not found'
                }
                return next(error);
            }

            res.status(200).json({ category: category });
        } catch (error) {

        }
    },

    // @desc get a category
    // @route /api/category/:id
    // @access public
    async getCategory(req, res, next) {
        try {
            const { id } = req.params;
            const category = await Category.findById(id);
            if (!category) {
                const error = {
                    status: 404,
                    message: 'Category not found'
                }
                return next(error);
            }

            res.status(200).json({ category: category });
        } catch (error) {
            return next(error);
        }
    },
    // @desc create a category
    // @route /api/category/:id
    // @access private
    async deleteCategory(req, res, next) {
        const { id } = req.params;

        try {
            await Category.findByIdAndDelete(id);

            res.status(200).json({ message: 'Category deleted successfully' })
        } catch (error) {
            return next(error);
        }
    },
    // @desc create a category
    // @route /api/category/update/:id
    // @access private
    async updateCategory(req, res, next) {
        try {
            const { id, title } = req.body;
            console.log(title, id);
            await Category.findByIdAndUpdate({ _id: id }, { title: title }, {new: true})

            res.status(200).json({ message: 'Category updated successfully' });
        } catch (error) {
            console.log(error, 'update category failed')
            return next(error);
        }
    }
}

module.exports = categoryContoller;