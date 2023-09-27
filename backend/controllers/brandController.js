const Brand = require('../models/brand');
const cloudinary = require('cloudinary').v2;
const { CLOUD_NAME, API_KEY, API_SECRET } = require('../config/index');

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
})

const brandContoller = {

    // @desc create a brand
    // @route /api/brand/create
    // @access private
    async createBrand(req, res, next) {
       


        try {
            const { title } = req.body;     

            const upper = title.charAt(0).toUpperCase() + title.substring(1);
            
            const alreadyExists = await Brand.findOne({title: upper});
            if(alreadyExists){
                const error = {
                    status: 409,
                    message: 'Brand already exists'
                }
                return next(error);
            }
            const newBrand = new Brand({
                title: upper
            });

            await newBrand.save();

            res.status(200).json({ message: 'Brand successfully created' });
        } catch (error) {
            return next(error);
        }
    },

    // @desc get all brand
    // @route /api/brand/all
    // @access public
    async getAllBrand(req, res, next) {
        try {
            const brand = await Brand.find({});
            if (!brand) {
                const error = {
                    status: 404,
                    message: 'Brand not found'
                }
                return next(error);
            }

            res.status(200).json({ brand: brand });
        } catch (error) {
            return next(error);
        }
    },

    // @desc get a brand
    // @route /api/brand/:id
    // @access public
    async getBrand(req, res, next) {
        try {
            const { id } = req.params;
            const brand = await Brand.findById(id);
            if (!brand) {
                const error = {
                    status: 404,
                    message: 'Brand not found'
                }
                return next(error);
            }

            res.status(200).json({ brand: brand });
        } catch (error) {
            return next(error);
        }
    },
    // @desc create a brand
    // @route /api/brand/:id
    // @access private
    async deleteBrand(req, res, next) {
        const { id } = req.params;

        try {
            await Brand.findByIdAndDelete(id);

            res.status(200).json({ message: 'brand successfully deleted' });
        } catch (error) {
            return next(error);
        }
    },
    // @desc create a brand
    // @route /api/brand/update/:id
    // @access private
    async updateBrand(req, res, next) {
        const { id, title } = req.body;
        try {

            await Brand.findByIdAndUpdate({_id: id}, { title: title });

            res.status(200).json({ message: 'Brand updated successfully' });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = brandContoller;