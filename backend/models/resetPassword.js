const mongoose = require('mongoose');

const { Schema } = mongoose;

const resetPasswordSchema = new Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId, 
        ref: 'User'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
    {
        timestamps: true,
    })


module.exports = mongoose.model('ResetPassword', resetPasswordSchema);