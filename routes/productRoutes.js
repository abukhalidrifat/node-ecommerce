const express = require('express');
const router = express.Router();


// import controllers
const productController = require('../controllers/productController');

router.get('/getproducts',productController.getProductsFromDB);
router.get('/getproduct/:productId',productController.getSingleProduct);


module.exports = router; 