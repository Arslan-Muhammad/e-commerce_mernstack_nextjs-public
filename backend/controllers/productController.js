const Product = require('../models/product');
const User = require('../models/user');
const cloudinary = require('cloudinary').v2;
const { CLOUD_NAME, API_KEY, API_SECRET } = require('../config/index');

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
})

const productController = {

    async createProduct(req, res, next) {

        const { title, description, price, quantity, images, brand, category, colors } = req.body;
        
        try {

            const photos = [...images]

            const allImages = [];

            for (let i = 0; i < photos.length; i++) {
                const image = photos[i];
                const response = await cloudinary.uploader.upload(image.thumbUrl, {
                    folder: "e-commerce"
                })

                allImages.push({
                    public_id: response.public_id,
                    url: response.secure_url,
                })
            }

            await Product.create({
                title,
                description,
                brand,
                category,
                price,
                quantity,
                images: allImages,
                colors,
            });

            res.status(200).json({ message: 'product add successfully' });
        } catch (error) {
            return next(error);
        }
    },

    // @desc get all products with filter sort pagination and search
    // @route /api/product/all
    // @access public
    async getAllProducts(req, res, next) {
        try {
            // filter
            const queryObject = { ...req.query };
            const excludeFields = ["page", "limit", "sort", 'fields', 'search'];
            excludeFields.forEach((field) => delete queryObject[field]);

            // { price: { gt: '20000' } }  // before
            // { price: { $gt: '20000' } } // convert to this format
            // filteration by [gte, gt, lt, lte]
            let objectStr = JSON.stringify(queryObject);
            objectStr = objectStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)

            // paginations
            // const page = +req.query.page || 1;
            // const limit = +req.query.limit || 5;
            // const skip = (page - 1) * limit;
            // new 
            // const endIndex = page * limit;

            // const documentCount = await Product.countDocuments();

            // // pagigation results
            // const pagination = {};
            // pagination.currentPage = page;
            // pagination.limit = limit;
            // pagination.numberOfPages = Math.ceil(documentCount / limit); // 0.2 covert to 1

            // // next page 
            // if (endIndex < documentCount) {
            //     pagination.nextPage = page + 1;
            // }
            // // previous page
            // if (skip > 0) {
            //     pagination.prevPage = page - 1;
            // }

            // if product not found
            // if (req.query.page) {
            //     const productCount = await Product.countDocuments();
            //     if (skip >= productCount) {
            //         const error = {
            //             status: 404,
            //             message: "Page Not Found",
            //         }
            //         return next(error);
            //     }
            // }

            // Build the Query
            let mongooseQueries = Product.find(JSON.parse(objectStr)) // .skip(skip).limit(limit);

            // sorting after Biuld the Query
            if (req.query.sort) {
                // console.log(req.query.sort, "sorting"); // price,-title (price have coma (price sold));
                const querySort = req.query.sort.split(",").join(" ");
                // console.log(querySort); // price title which is ok now
                mongooseQueries = mongooseQueries.sort(querySort);
            } else {
                mongooseQueries = mongooseQueries.sort("-createdAt");

            }

            // field limiting
            if (req.query.fields) {
                const fields = req.query.fields.split(",").join(" ");
                mongooseQueries = mongooseQueries.select(fields);
            } else {
                mongooseQueries = mongooseQueries.select("-__v");
            }

            // search
            if (req.query.search) {
                const query = {};
                query.$or = [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } }
                ],
                    mongooseQueries = mongooseQueries.find(query);
                // console.log(query); // { '$or': [ { title: [Object] }, { description: [Object] } ] }
            }

            // Execute the query
            const products = await mongooseQueries;

            res.status(200).json({ result: products.length,  products: products }); // pagination,
        } catch (error) {
            return next(error);
        }

    },

    // @desc get a product
    // @route /api/product/:id
    // @access public
    async getProduct(req, res, next) {
        const { id } = req.params;
        try {
            const findProduct = await Product.findById(id);
            res.status(200).json({ product: findProduct });
        } catch (error) {
            return next(error);
        }
    },

    // @desc delete a product
    // @route /api/product/update/:id
    // @access private
    async updateProduct(req, res, next) {
        try {


            const { id, title, description, price, quantity, images, colors, brand, category } = req.body;

            const newImages = images.filter((image) => image.thumbUrl);

            const oldImages = images.filter((image) => image.url);

            const oldImagesSecreUrls = oldImages.map((image) => image.url);


            const oldProduct = await Product.findOne({ _id: id });

            const photos = oldProduct.images;

            const fileToDelete = photos.filter(
                (image) => !oldImagesSecreUrls.includes(image.url)
            );

            fileToDelete.map(async (image) => {
                await cloudinary.uploader.destroy(image.public_id);
            });

            let allImages = [...oldImages];

            for (let index = 0; index < newImages.length; index++) {
                const image = await cloudinary.uploader.upload(
                    newImages[index].thumbUrl,
                    {
                        folder: "e-commerce",
                    }
                );

                allImages.push({
                    public_id: image.public_id,
                    url: image.secure_url,
                });
            }

            let updateData = {
                title, description, price, quantity, images: allImages, colors, brand, category
            };

            await Product.updateOne({ _id: id }, updateData);

            return res.status(200).json({ message: 'Successfuly Updated' })

        } catch (error) {
            return next(error);
        }
    },


    // @desc delete a product
    // @route /api/product/:id
    // @access private
    async deleteProduct(req, res, next) {

        const { id } = req.params;
        try {
            const product = await Product.findOne({ _id: id });
            if (product === null) {
                const error = {
                    status: 404,
                    message: 'Product not found'
                }
                return next(error);
            }

            if (product.images) {

                for (let i = 0; i < product.images.length; i++) {
                    const image = product.images[i];
                    await cloudinary.uploader.destroy(image.public_id);
                }
            }

            await Product.findOneAndDelete({ _id: id });

            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            next(error);
        }
    },

    async addToWishlist(req, res, next) {
        const { _id } = req.user;
        const { prodId } = req.body;
        try {
            const user = await User.findById(_id);
            const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
            if (alreadyadded) {
                let user = await User.findByIdAndUpdate(
                    _id,
                    {
                        $pull: { wishlist: prodId },
                    },
                    {
                        new: true,
                    }
                );
                res.json(user);
            } else {
                let user = await User.findByIdAndUpdate(
                    _id,
                    {
                        $push: { wishlist: prodId },
                    },
                    {
                        new: true,
                    }
                );
                res.json(200).json({ user: user });
            }
        } catch (error) {
            next(error);
        }
    },

    async rating(req, res, next) {
        const { _id } = req.user;
        const { star, prodId, comment } = req.body;
        try {
            const product = await Product.findById(prodId);
            let alreadyRated = product.ratings.find(
                (userId) => userId.postedby.toString() === _id.toString()
            );
            if (alreadyRated) {
                const updateRating = await Product.updateOne(
                    {
                        ratings: { $elemMatch: alreadyRated },
                    },
                    {
                        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                    },
                    {
                        new: true,
                    }
                );
            } else {
                const rateProduct = await Product.findByIdAndUpdate(
                    prodId,
                    {
                        $push: {
                            ratings: {
                                star: star,
                                comment: comment,
                                postedby: _id,
                            },
                        },
                    },
                    {
                        new: true,
                    }
                );
            }
            const getallratings = await Product.findById(prodId);
            let totalRating = getallratings.ratings.length;
            let ratingsum = getallratings.ratings
                .map((item) => item.star)
                .reduce((prev, curr) => prev + curr, 0);
            let actualRating = Math.round(ratingsum / totalRating);
            let finalproduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    totalrating: actualRating,
                },
                { new: true }
            );
            res.json(finalproduct);
        } catch (error) {
            throw new Error(error);
        }
    },

}

module.exports = productController;