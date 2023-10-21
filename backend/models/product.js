const mongoose = require("mongoose");

const { Schema } = mongoose;
const productSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        images: [
            {
                public_id: String,
                url: String,
            },
        ],
        sold: {
            type: Number,
            default: 0,
            // select: false // field not show in res
        },
        colors: [{
            label: {
                type: String,
                required: true,
            },
            value: {
                type: String,
                required: true,
            }
        }],
    },
    { timestamps: true }
);


module.exports = mongoose.model("Product", productSchema);
