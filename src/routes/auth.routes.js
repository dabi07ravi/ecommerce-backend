
const router = require('express').Router()
const authController  = require('../controllers/auth.controller');



router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refreshToken', authController.refreshToken);
router.post('/logout', authController.logout);





module.exports = router;