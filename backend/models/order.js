const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        _id: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Product",
        },
        qty: Number,
        color: String,
        totalPrice: Number
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Payment Pending",
        "Paid",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
    orderby: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Order", orderSchema);
