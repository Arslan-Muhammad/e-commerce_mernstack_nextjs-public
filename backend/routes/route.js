const express = require('express');
const { register, login, logout, refresh, getAllUsers, getUserById, forgetPasswordToken, blockUser, unblockUser, adminLogin, changePassword, resetPassword } = require('../controllers/authController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct, addToWishlist, rating } = require('../controllers/productController');
const { createCategory, getAllCategory, getCategory, deleteCategory, updateCategory } = require('../controllers/categoryController');
const { createBrand, getAllBrand, getBrand, updateBrand, deleteBrand } = require('../controllers/brandController');
const { getOrders, getAllOrders, updateOrderStatus, createOrder } = require('../controllers/orderController');
const { createColor, getColors, getColor, updateColor, deleteColor } = require('../controllers/colorController');
const isBlocked = require('../middlewares/isBlocked');
const {createAddress, getAddress, updateAddress} = require('../controllers/addressController')

const router = express.Router();

// @desc Test Api
// @route /api/
// @access public
router.get('/', (req, res) => {
    res.send({ 'message': 'Welcome' })
})

// @desc auth routes
// @ route /api/
router.post('/api/register', register);
router.post('/api/login', login);
router.post('/api/logout', auth, logout);  // authenticated
router.get('/api/refresh', refresh);
router.get('/api/users/all', auth, isAdmin, getAllUsers); // authenticated // server siderender error
router.get('/api/user/:id', auth, isAdmin, getUserById); //authenticated
router.put('/api/user/block/:id', auth, isAdmin, blockUser);
router.put('/api/user/unblock/:id', auth, isAdmin, unblockUser);
router.put('/api/user/change-password', auth, changePassword)
router.post('/api/forget-password-token', forgetPasswordToken);
router.put('/api/reset-password', resetPassword);

// @desc admin login route
// @route /api/amin-login
router.post('/api/admin-login', adminLogin);

// @desc ProductController routes
router.post("/api/product/create", auth, isAdmin, isBlocked, createProduct);
router.get("/api/product/all", getAllProducts);
router.get("/api/product/:id", getProduct);
router.put("/api/product/update", auth, isAdmin, isBlocked, updateProduct);
router.delete("/api/product/:id", auth, isAdmin, isBlocked, deleteProduct);
router.put("/api/product/wishlist", auth, isBlocked, addToWishlist);
router.put("/api/product/rating", auth, isBlocked, rating);

// @desc Category routes
router.post('/api/category/create', auth, isAdmin, isBlocked, createCategory);
router.get('/api/category/all', getAllCategory);
router.get('/api/category/:id', getCategory);
router.delete('/api/category/:id', auth, isAdmin, isBlocked, deleteCategory);
router.put('/api/category/update', auth, isAdmin, isBlocked, updateCategory);

// @desc Brand routes
router.post('/api/brand/create', auth, isAdmin, isBlocked, createBrand);
router.get('/api/brand/all', getAllBrand);
router.get('/api/brand/:id', getBrand);
router.delete('/api/brand/:id', auth, isAdmin, isBlocked, deleteBrand);
router.put('/api/brand/update', auth, isAdmin, isBlocked, updateBrand);

// @desc colorController route
router.post('/api/color/create', auth, isAdmin, isBlocked, createColor);
router.get('/api/color/all', getColors);
router.get('/api/color/:id', getColor);
router.put('/api/color/update', auth, isAdmin, isBlocked, updateColor);
router.delete('/api/color/:id', auth, isAdmin, isBlocked, deleteColor);

// @desc address routes
router.post('/api/createAddress', auth, isBlocked, createAddress);
router.get('/api/getAddress', auth,  getAddress);
router.put('/api/updateAddress', auth, isBlocked, updateAddress);

// @desc OrderController routes
router.post("/api/createOrder", auth, isBlocked, createOrder);
router.get("/api/get-orders", auth, isBlocked, getOrders);
router.get("/api/getallorders", auth, isAdmin, isBlocked, getAllOrders);
router.get("/api/getorderbyuser/:id", auth, isAdmin, isBlocked, getAllOrders);
router.put("/api/order/update-order/:id", auth, isAdmin, isBlocked, updateOrderStatus);

module.exports = router;