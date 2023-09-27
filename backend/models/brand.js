const mongoose = require("mongoose");

const { Schema } = mongoose;
const brandSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model("Brand", brandSchema);
