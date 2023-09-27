const mongoose = require('mongoose');

const { Schema } = mongoose;

const tokenSchema = new Schema({
   // register user _id
    userId: {
        type: mongoose.SchemaTypes.ObjectId, ref: 'User'
   },
    // REFRESHTOKEN 
    token: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
}
)

module.exports = mongoose.model('Token', tokenSchema);