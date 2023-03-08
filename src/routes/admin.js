const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');
const UserDetailController = require('../app/controllers/UserDetailController');
const adminCategory = require('../app/controllers/AdminCategory');
const security = require('../security/authenticationAdmin');
const { editIn4, editIn4Save } = require('../app/controllers/AdminController');

// newsController.index;

router.get('/',security.auth, adminController.dashboard);

//theme
router.get("/theme", security.auth, adminController.goTheme);

router.get("/theme/update/:id", security.auth, adminController.goThemeUpdate);

router.post("/theme/update/:id", security.auth, adminController.doThemeUpdate);

router.get("/theme/add", security.auth, adminController.goThemeAdd);

router.post("/theme/add", security.auth, adminController.doThemeAdd);

router.get("/theme/delete/:id", security.auth, adminController.doThemeDelete);

//admindetail
router.get('/account', adminController.detail);

router.get('/account/logout',UserDetailController.logout);

router.get('/account/changePassword',adminController.changePassword);

router.post('/account/changePassword',adminController.changePasswordSave);

router.get('/account/editInfor',adminController.editIn4); 

router.post('/account/editInfor',adminController.editIn4Save);

// order
router.get('/order/',adminController.orderManager);

router.get('/order/compeleted/:id',adminController.orderstatus);

router.get('/order/delivery/:id',adminController.orderstatusD);

//products
router.get('/products/', adminController.productManager);

router.get('/products/add', adminController.addProduct);

router.post('/products/addP',adminController.SubmitProduct);

router.get('/products/update/:id', adminController.updateProduct);

router.get('/products/search', adminController.searchProduct);

router.get('/products/delete/:id', adminController.deleteProduct);

router.post('/products/updateP', adminController.update);//?


//category
router.get('/category', adminCategory.index);

router.post('/category/add', adminCategory.addCategory)

router.get('/category/add', adminCategory.category);

router.get('/category/delete/:id', adminCategory.deleteCategory)

router.get('/category/edit/:id', adminCategory.viewCategory)

router.post('/category/edit', adminCategory.editCategory)






module.exports = router;