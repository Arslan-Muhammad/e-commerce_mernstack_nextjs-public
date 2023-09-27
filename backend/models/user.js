const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // roles after complete authentication
    role: {
        type: String,
        default: 'user'
    },
    // disable user access 
    isBlocked: {
        type: Boolean,
        default: false
    },
    wishlist: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product" }],

},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema);