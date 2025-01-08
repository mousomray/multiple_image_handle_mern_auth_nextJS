const express = require('express');
const routeLabel = require('route-label');
const productController = require('../../webservice/productApiController');
const uploadImage = require('../../helper/imagehandler') // Image area
const { UserAuth } = require('../../middleware/user_auth/auth')

// Initiallize the express router for router object
const router = express.Router();
const namedRouter = routeLabel(router);

namedRouter.post('addproduct', '/addproduct', UserAuth, uploadImage.array('image'), productController.addProduct);
namedRouter.get('products', '/products', UserAuth, productController.showproduct)
namedRouter.get('singleproduct', '/product/:id', UserAuth, productController.singleProduct)
namedRouter.put('updateproduct', '/updateproduct/:id', UserAuth, uploadImage.array('image'), productController.updateProduct)
namedRouter.delete('deleteproduct', '/deleteproduct/:id', UserAuth, productController.deleteProduct)
namedRouter.get('categories', '/products/categories', UserAuth, productController.showCategories)
namedRouter.get('categorydetails', '/products/category/:category', UserAuth, productController.categorydetails)
namedRouter.post('searchPost', '/products/search', UserAuth, productController.searchPost)
namedRouter.get('filterbysize', '/products/filterbysize', UserAuth, productController.filterBySize);
namedRouter.get('filterbycolor', '/products/filterbycolor', UserAuth, productController.filterByColor);

module.exports = router;   