const mongoose = require("mongoose");

const { Schema } = mongoose;
const colorSchema = new Schema(
    {
        label: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model("Color", colorSchema);
