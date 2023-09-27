const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema(
    {
        orderby: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
        },
        products: [
            {
                product: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "Product",
                },
                count: Number,
                color: String,
                price: Number,
            },
        ],
        cartTotal: Number,
        totalAfterDiscount: Number,

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Cart", cartSchema);
