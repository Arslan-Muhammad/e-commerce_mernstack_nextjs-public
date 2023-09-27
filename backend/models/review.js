const mongoose = require("mongoose");

const { Schema } = mongoose;
const reviewSchema = new Schema(
    {
        ratings: [
            {
                star: Number,
                comment: String,
                postedby: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
            },
        ]
    
    },
    { timestamps: true }
);


module.exports = mongoose.model("Review", reviewSchema);
