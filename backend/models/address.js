const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressSchema = new Schema({
    userId:  { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    name: {
        type: String,
    },

    address: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Address', addressSchema);