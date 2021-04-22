const express = require('express');
const router = express.Router();
const upload = require('../app');
const isAuth = require('../middlewares/is-auth');
const isAdmin = require('../middlewares/is-admin');

// import controllers
const adminController = require('../controllers/adminController');
// const productController = require('../controllers/productController');

// router.get('/getallproducts',isAuth,isAdmin,productController.getProductsFromDB);

// add products
router.post('/addproduct',isAuth,isAdmin,upload.array('images'),adminController.addProduct);

// edit products
router.put('/editproduct/:itemId',isAuth,isAdmin,upload.array("images"),adminController.editProduct);

// delete products
router.delete('/deleteproduct/:productId',isAuth,isAdmin,adminController.deleteProduct)

// delete single product image
router.post('/clearimage/:productId/:imageId',isAuth,isAdmin,adminController.deleteImage)

module.exports = router; 