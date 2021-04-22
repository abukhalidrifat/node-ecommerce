const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount_price: {
      type: Number,
    },
    images: [
      {
        path: String,
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
