const Product = require("../models/Product");
const clearImage = require("../util/clearImage");

exports.addProduct = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const discount_price = req.body.discount_price;
  const images = req.files;

  const product = new Product({
    name: name,
    description: description,
    price: price,
    discount_price: discount_price,
  });

  // storing images
  for (const image in images) {
    const imagePath = { path: images[image].path };
    product.images.push(imagePath);
  }

  product
    .save()
    .then((result) => {
      res.status(201).json({
        result: result,
        message: "Product added successfully :)",
      });
    })
    .catch((err) => {
      // if (!err.statusCode) {
      //   err.statusCode = 500;
      // }
    });
};

exports.editProduct = (req, res, next) => {
  const itemId = req.params.itemId;
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const discount_price = req.body.discount_price;
  const images = req.files;
  let imagePath;

  Product.findById(itemId)
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: "Product not found!" });
        return;
      }
      product.name = name;
      product.description = description;
      product.price = price;
      product.discount_price = discount_price;

      // storing images
      if (images.length > 0) {
        for (const image in images) {
          imagePath = { path: images[image].path };
          product.images.push(imagePath);
        }
      }
      return product.save();
    })
    .then((editedProduct) => {
      res.status(200).json({
        product: editedProduct,
        message: "product edited successfully",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (product.images.length > 0) {
        product.images.forEach((image) => {
          clearImage(image.path);
        });
      }
      return Product.findByIdAndRemove(productId);
    })
    .then((result) => {
      res.status(200).json({
        result: result,
        message: "product deleted successfully",
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteImage = (req, res, next) => {
  const productId = req.params.productId;
  const imageId = req.params.imageId;
  const path = req.body.path;

  Product.findById(productId)
    .then((item) => {
      item.images.pull(imageId);
      item.save();
      clearImage(path);
      res.status(200).json({
        message: "image delete successful",
        item
      })
    })
    .catch((err) => {
      console.log(err);
    });
};
