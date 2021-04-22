const Product = require("../models/Product");

exports.getProductsFromDB = (req, res, next) => {
  Product.find()
    .select("_id name price discount_price images")
    .then((items) => {
      res.status(200).json({
        items: items,
        message: "Products fetched successfully",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSingleProduct = (req, res, next) => {
  const itemId = req.params.productId;
  Product.findById(itemId).then((item) => {
    res.status(200).json({ item });
  }).catch(err => {
    console.log(err);
  });
};
