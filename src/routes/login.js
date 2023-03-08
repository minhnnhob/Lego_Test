const express = require('express');
const router = express.Router();

const LoginController = require('../app/controllers/LoginController');
const validation = require('../validation/registerValidation');

// newsController.index;
router.get('/login', LoginController.login);
router.post('/login', LoginController.checkLogin);
router.post('/register',validation.isEmailExisted, validation.isUserNameExisted, validation.register, LoginController.registerAction);
router.get('/register', LoginController.register);


module.exports = router;